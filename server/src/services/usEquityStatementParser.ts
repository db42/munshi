import { USEquityStatement, USEquityTransaction, DividendIncome, CapitalGainSummary, TransactionType } from '../types/usEquityStatement';
import { ConversionResult } from '../generators/itr/types';

/**
 * Parser for US equity broker statements.
 * Currently supports CSV format from major brokers.
 */
export class USEquityStatementParser {
  /**
   * Parse a broker statement from CSV format into our intermediate USEquityStatement format
   * @param csvContent The raw CSV content from the broker statement
   * @param brokerType The type of broker (e.g., 'schwab', 'fidelity', 'robinhood', etc.)
   * @param taxpayerInfo Basic taxpayer information
   * @returns A ConversionResult containing the parsed USEquityStatement or an error
   */
  static parseFromCSV(
    csvContent: string, 
    brokerType: string,
    taxpayerInfo: { name: string; pan: string }
  ): ConversionResult<USEquityStatement> {
    try {
      // Initialize an empty statement
      const statement: USEquityStatement = {
        taxpayerName: taxpayerInfo.name,
        taxpayerPAN: taxpayerInfo.pan,
        brokerName: brokerType.charAt(0).toUpperCase() + brokerType.slice(1), // Capitalize broker name
        brokerAccountNumber: '', // Will be extracted from the CSV
        statementPeriod: {
          startDate: new Date(), // Will be determined from transactions
          endDate: new Date(),   // Will be determined from transactions
        },
        transactions: [],
        dividends: [],
        capitalGains: {
          shortTerm: {
            totalProceeds: 0,
            totalCostBasis: 0,
            totalGain: 0,
            totalForeignTaxPaid: 0
          },
          longTerm: {
            totalProceeds: 0,
            totalCostBasis: 0,
            totalGain: 0,
            totalForeignTaxPaid: 0
          }
        },
        taxWithheld: {
          dividendTax: 0,
          capitalGainsTax: 0
        }
      };

      // Parse the CSV based on broker type
      switch (brokerType.toLowerCase()) {
        case 'schwab':
          this.parseSchwabCSV(csvContent, statement);
          break;
        case 'fidelity':
          this.parseFidelityCSV(csvContent, statement);
          break;
        case 'robinhood':
          this.parseRobinhoodCSV(csvContent, statement);
          break;
        // Add more brokers as needed
        default:
          return {
            success: false,
            error: `Unsupported broker type: ${brokerType}`
          };
      }

      // Calculate statement period from transactions
      if (statement.transactions.length > 0) {
        // Sort transactions by date
        statement.transactions.sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
        
        // Set statement period
        statement.statementPeriod.startDate = statement.transactions[0].transactionDate;
        statement.statementPeriod.endDate = statement.transactions[statement.transactions.length - 1].transactionDate;
      }

      // Calculate capital gains summaries
      this.calculateCapitalGains(statement);

      return {
        success: true,
        data: statement
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse broker statement: ${error}`
      };
    }
  }

  /**
   * Parse Charles Schwab CSV format
   * @param csvContent The raw CSV content
   * @param statement The statement object to populate
   */
  private static parseSchwabCSV(csvContent: string, statement: USEquityStatement): void {
    // Split the CSV content into lines
    const lines = csvContent.trim().split('\n');
    
    // Extract account number from the header (sample implementation)
    const accountLine = lines.find(line => line.includes('Account Number'));
    if (accountLine) {
      const match = accountLine.match(/Account Number:\s*(\w+)/);
      if (match && match[1]) {
        statement.brokerAccountNumber = match[1];
      }
    }

    // Find the transaction table header
    const headerIndex = lines.findIndex(line => 
      line.includes('Date') && 
      line.includes('Action') && 
      line.includes('Symbol') && 
      line.includes('Description')
    );

    if (headerIndex === -1) {
      throw new Error('Could not find transaction table header in Schwab CSV');
    }

    // Parse column headers
    const headers = lines[headerIndex].split(',').map(h => h.trim());
    
    // Parse transaction rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue; // Skip empty lines
      
      const values = this.parseCSVLine(line);
      if (values.length !== headers.length) continue; // Skip malformed lines
      
      // Create a map of header -> value
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      // Process based on transaction type
      const action = row['Action'] || '';
      
      if (action.includes('Buy') || action.includes('Sell')) {
        // Stock transaction
        const transaction: USEquityTransaction = {
          transactionId: `SCH-${i}-${Date.now()}`, // Generate a unique ID
          securityName: row['Description'] || '',
          symbol: row['Symbol'] || '',
          transactionDate: new Date(row['Date'] || ''),
          type: action.includes('Buy') ? TransactionType.BUY : TransactionType.SELL,
          quantity: parseFloat(row['Quantity'] || '0'),
          pricePerUnit: parseFloat(row['Price'] || '0'),
          totalAmount: Math.abs(parseFloat(row['Amount'] || '0')),
          feesBrokerage: parseFloat(row['Fees'] || '0'),
          exchangeRate: 82.5, // Example rate, in production this would be fetched from an API
          amountINR: Math.abs(parseFloat(row['Amount'] || '0')) * 82.5,
          notes: row['Notes'] || ''
        };
        
        // For sell transactions, try to find the acquisition date
        if (transaction.type === TransactionType.SELL) {
          // In a real implementation, you would look up the acquisition date 
          // from previous transactions or from additional data in the CSV
          // For now, let's assume it's a year ago
          const acquisitionDate = new Date(transaction.transactionDate);
          acquisitionDate.setFullYear(acquisitionDate.getFullYear() - 1);
          transaction.acquisitionDate = acquisitionDate;
        }
        
        statement.transactions.push(transaction);
      } else if (action.includes('Dividend') || action.includes('Distribution')) {
        // Dividend income
        const dividend: DividendIncome = {
          securityName: row['Description'] || '',
          symbol: row['Symbol'] || '',
          paymentDate: new Date(row['Date'] || ''),
          grossAmount: parseFloat(row['Amount'] || '0'),
          taxWithheld: parseFloat(row['Withholding'] || '0'),
          netAmount: parseFloat(row['Amount'] || '0') - parseFloat(row['Withholding'] || '0'),
          exchangeRate: 82.5, // Example rate
          grossAmountINR: parseFloat(row['Amount'] || '0') * 82.5,
          taxWithheldINR: parseFloat(row['Withholding'] || '0') * 82.5,
          netAmountINR: (parseFloat(row['Amount'] || '0') - parseFloat(row['Withholding'] || '0')) * 82.5
        };
        
        statement.dividends.push(dividend);
        statement.taxWithheld.dividendTax += dividend.taxWithheldINR;
        
        // Also add as a transaction
        statement.transactions.push({
          transactionId: `SCH-DIV-${i}-${Date.now()}`,
          securityName: dividend.securityName,
          symbol: dividend.symbol,
          transactionDate: dividend.paymentDate,
          type: TransactionType.DIVIDEND,
          quantity: 0, // Not applicable for dividends
          pricePerUnit: 0, // Not applicable for dividends
          totalAmount: dividend.grossAmount,
          feesBrokerage: 0,
          exchangeRate: dividend.exchangeRate,
          amountINR: dividend.grossAmountINR,
          notes: 'Dividend payment'
        });
      }
    }
  }

  /**
   * Parse Fidelity CSV format
   * @param csvContent The raw CSV content
   * @param statement The statement object to populate
   */
  private static parseFidelityCSV(csvContent: string, statement: USEquityStatement): void {
    // Implementation would be similar to Schwab but with Fidelity's specific CSV format
    // This is a placeholder for the actual implementation
    throw new Error('Fidelity CSV parsing not yet implemented');
  }

  /**
   * Parse Robinhood CSV format
   * @param csvContent The raw CSV content
   * @param statement The statement object to populate
   */
  private static parseRobinhoodCSV(csvContent: string, statement: USEquityStatement): void {
    // Implementation would be similar to Schwab but with Robinhood's specific CSV format
    // This is a placeholder for the actual implementation
    throw new Error('Robinhood CSV parsing not yet implemented');
  }

  /**
   * Helper method to properly parse CSV lines with quoted values
   * @param line A CSV line
   * @returns Array of values
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current); // Add the last value
    return result;
  }

  /**
   * Calculate capital gains summaries from transactions
   * @param statement The statement to update with capital gains calculations
   */
  private static calculateCapitalGains(statement: USEquityStatement): void {
    // Reset capital gains
    statement.capitalGains.shortTerm = {
      totalProceeds: 0,
      totalCostBasis: 0,
      totalGain: 0,
      totalForeignTaxPaid: 0
    };
    
    statement.capitalGains.longTerm = {
      totalProceeds: 0,
      totalCostBasis: 0,
      totalGain: 0,
      totalForeignTaxPaid: 0
    };

    // Process sell transactions
    const sellTransactions = statement.transactions.filter(t => t.type === TransactionType.SELL);
    
    for (const sellTx of sellTransactions) {
      if (!sellTx.acquisitionDate) continue;
      
      // Calculate holding period in days
      const holdingPeriod = Math.floor(
        (sellTx.transactionDate.getTime() - sellTx.acquisitionDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Determine if short-term or long-term
      // In India, assets held for more than 24 months (usually) are considered long-term
      // This may need to be adjusted based on specific tax laws
      const isLongTerm = holdingPeriod > 730; // Approximately 2 years
      
      // Find matching buy transaction
      // In a real implementation, you would need a more sophisticated matching algorithm
      // This is a simplified example
      const buyTransactions = statement.transactions.filter(t => 
        t.type === TransactionType.BUY && 
        t.symbol === sellTx.symbol &&
        t.transactionDate <= sellTx.acquisitionDate!
      );
      
      if (buyTransactions.length === 0) continue;
      
      // Use the most recent buy transaction before the acquisition date as the cost basis
      // Again, this is simplified - a real implementation would be more complex
      const matchingBuyTx = buyTransactions
        .sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime())[0];
      
      const proceeds = sellTx.amountINR;
      const costBasis = matchingBuyTx.amountINR;
      const gain = proceeds - costBasis;
      
      // Update the appropriate capital gains summary
      if (isLongTerm) {
        statement.capitalGains.longTerm.totalProceeds += proceeds;
        statement.capitalGains.longTerm.totalCostBasis += costBasis;
        statement.capitalGains.longTerm.totalGain += gain;
      } else {
        statement.capitalGains.shortTerm.totalProceeds += proceeds;
        statement.capitalGains.shortTerm.totalCostBasis += costBasis;
        statement.capitalGains.shortTerm.totalGain += gain;
      }
    }
  }
} 