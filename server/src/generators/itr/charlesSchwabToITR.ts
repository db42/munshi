import { CharlesSchwabCSVData, TransactionAction, CharlesSchwabRecord} from '../../services/charlesSchwabCSVParser';
import { ScheduleFA } from '../../types/itr';
import { getRelevantDates, identifyCalendarYear, ParseResult } from '../../utils/parserTypes';
import { findPeakPrice } from '../../utils/equityPriceUtils';
import { getExchangeRate } from '../../utils/currencyConverter';

// {
//     "Country": "United States",
//     "Name_of_Entity": "Charles Schwab",
//     "Address_of_Entity": "One Pickwick Plaza, Greenwich, CT, USA",
//     "Zip_Code": "06830",
//     "Nature_of_Asset": "Stocks",
//     "Date_of_Acquisition": "2024-01-01",
//     "Initial_Investment_INR": 779000,
//     "Peak_Value_INR": 779000,
//     "Closing_Value_INR": 710000
//     "Total_Gross_Amount_INR": 710000
//     "Sales_proceeds_or_redemption_amount_INR": 710000
// }
// Interface for year-end holdings (for Schedule FA)
export interface SecurityHolding {
  symbol: string;
  securityName: string;
  address: string;
  zipCode: string;
  natureOfAsset: string;
  dateOfAcquisition: Date;
  initialInvestmentINR: number;
  peakValueINR: number;
  peakValueDate: Date; //not used in Schedule FA directly
  closingValueINR: number;
  totalGrossAmountINR: number;
  salesProceedsOrRedemptionAmountINR: number; // in INR
}

// Interface for a buy transaction lot
interface BuyLot {
  date: Date;
  quantity: number;
  price: number;
  cost: number;
  sellQuantity?: number; // Remaining quantity after FIFO matching
  sellDate?: Date;
}

// Interface for tracking security holdings
interface SecurityInfo {
  symbol: string;
  securityName: string;
  buyLots: BuyLot[];
}

// Define the output interface specifically for Schedule FA
export interface ScheduleFAData {
  taxpayerName: string;
  taxpayerPAN: string;
  brokerName: string;
  brokerAccountNumber: string;
  calendarYear: number;
  holdings: SecurityHolding[];
}

/**
 * Generates Schedule FA entries from Charles Schwab CSV data
 * 
 * @param csvData - Parsed Charles Schwab CSV data
 * @returns Array of Schedule FA entries
 */
function getSecurityHoldings(csvData: CharlesSchwabCSVData, calendarYearStart: Date, calendarYearEnd: Date): SecurityHolding[] {
  const { records, accountNumber } = csvData;

  if (!records || records.length === 0) {
    console.warn('No records found in Charles Schwab CSV data');
    return [];
  }

  // Filter for only Buy and Sell transactions
  const filteredRawRecords = records.filter((record: CharlesSchwabRecord) => 
    record.action === TransactionAction.Buy || record.action === TransactionAction.Sell
  );


  // Step 3: Apply FIFO to process transactions
  const securities = processTransactions(filteredRawRecords, calendarYearStart, calendarYearEnd);

  // Step 4: Build Schedule FA entries
  const holdings = buildScheduleFAEntries(securities, calendarYearStart, calendarYearEnd);

  return holdings;
};


/**
 * Converts Charles Schwab CSV data to ITR sections
 * 
 * @param csvData - Parsed Charles Schwab CSV data
 * @returns Object containing the generated ITR sections
 */
export function convertCharlesSchwabCSVToITR(csvData: CharlesSchwabCSVData, financialYear: string): ParseResult<ScheduleFA> {
  if (!csvData) {
    return {
      success: false,
      error: 'No Charles Schwab CSV data provided'
    };
  }

  try {
    // Step 1: Identify current calendar year from financial year
    const calendarYear = identifyCalendarYear(financialYear);
    const { calendarYearStart, calendarYearEnd } = getRelevantDates(calendarYear);

    // Generate Schedule FA
    const securityHoldings = getSecurityHoldings(csvData, calendarYearStart, calendarYearEnd);

    //todo: Generate Schedule FA from securityHoldings here
    const scheduleFA: ScheduleFA = generateScheduleFA(securityHoldings);

    return {
      success: true,
      data: scheduleFA
    };
  } catch (error) {
    console.error('Error converting Charles Schwab CSV to ITR:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error converting CSV to ITR'
    };
  }
}; 

/**
 * Processes transactions using FIFO method
 * 
 * @param records - Sorted CSV records
 * @param calendarYearStart - Start of calendar year
 * @param calendarYearEnd - End of calendar year
 * @returns Processed securities
 */
function processTransactions(
    records: CharlesSchwabRecord[],
    calendarYearStart: Date,
    calendarYearEnd: Date
  ) {
    // Initialize data structures
    const securities: Record<string, SecurityInfo> = {};
  
    //filter out invalid records
    const filteredRecords = records.filter(record => {
      return !isNaN(record.quantity) && !isNaN(record.price) && !isNaN(record.amount);
    });
  
    
    // Process all records chronologically
    filteredRecords.forEach(record => {
      const isInCalendarYear = record.date >= calendarYearStart && record.date <= calendarYearEnd;
  
      
      switch(record.action) {
        case TransactionAction.Buy:
          processBuyTransaction(record, securities);
          break;
          
        case TransactionAction.Sell:
          processSellTransaction(record, securities);
          break;
      }
    });
    
    console.log(`Processed ${records.length} records`);
    console.log(`Found ${Object.keys(securities).length} unique securities`);
    
    return securities;
  }
  
  /**
   * Processes a buy transaction
   */
  function processBuyTransaction(
    record: CharlesSchwabRecord,
    securities: Record<string, SecurityInfo>,
  ) {
    
    // Initialize security if not exists
    if (!securities[record.symbol]) {
      securities[record.symbol] = {
        symbol: record.symbol,
        securityName: record.description,
        buyLots: [],
      };
    }
  
    // Add buy lot
    securities[record.symbol].buyLots.push({
      date: record.date,
      quantity: record.quantity,
      price: record.price,
      cost: Math.abs(record.amount) + record.fees, // Include fees in cost basis
    });
  }
  
  /**
   * Processes a sell transaction using FIFO
   */
  function processSellTransaction(
    sellRecord: CharlesSchwabRecord,
    securities: Record<string, SecurityInfo>,
  ) {
    // Skip if security doesn't exist (shouldn't happen with proper data)
    if (!securities[sellRecord.symbol]) {
      console.warn(`Sell transaction for unknown security: ${sellRecord.symbol}`);
      return;
    }
  
    let soldQuantity = sellRecord.quantity;
    // Sort buy lots by date (oldest first) to implement FIFO
    securities[sellRecord.symbol].buyLots.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Match sell with buy lots
    for (const lot of securities[sellRecord.symbol].buyLots) {
      if (soldQuantity < lot.quantity) {
        //break down lot into smaller lots - create and push a new buylot with remaining quantity
        const remainingQuantity = lot.quantity - soldQuantity;
        const newBuyLot: BuyLot = {
          date: lot.date,
          quantity: remainingQuantity,
          price: lot.price,
          cost: (lot.cost / lot.quantity) * remainingQuantity,
        };
        securities[sellRecord.symbol].buyLots.push(newBuyLot);
  
        //update the original lot with the remaining quantity
        lot.sellQuantity = soldQuantity;
        lot.sellDate = sellRecord.date;
        soldQuantity = 0;
        break;
  
      } else {
        //fully sell the lot
        lot.sellDate = sellRecord.date;
        lot.sellQuantity = lot.quantity;
        soldQuantity -= lot.quantity;
      }
    }
    
    // Log warning if we couldn't match all shares
    if (soldQuantity > 0) {
      console.warn(`Could not match all shares for sell transaction of ${sellRecord.symbol}: ${soldQuantity} shares unmatched`);
    }
  }

/**
 * Builds Schedule FA entries from processed securities
 * 
 * @param securities - Processed securities
 * @param calendarYearStart - Start of calendar year
 * @param calendarYearEnd - End of calendar year
 * @returns Array of SecurityHolding objects for Schedule FA
 */
function buildScheduleFAEntries(
    securities: Record<string, SecurityInfo>,
    calendarYearStart: Date,
    calendarYearEnd: Date
  ): SecurityHolding[] {
    const yearEndHoldings: SecurityHolding[] = [];
    
    // Count statistics for reporting
    let holdingsOnDecember31 = 0;
    let transactedInCY = 0;
    
    // Process each security
    Object.values(securities).forEach(security => {
  
      //filter buy lots where either quantity-sellQuantity > 0 or sellDate is in the calendar year
      const remainingLots = security.buyLots.filter(lot => {
        const hasRemainingQuantity = lot.quantity - (lot.sellQuantity || 0) > 0;
        const wasSoldInYear = lot.sellDate && lot.sellDate >= calendarYearStart && lot.sellDate <= calendarYearEnd;
        return hasRemainingQuantity || wasSoldInYear;
      });
  
      //create security holding object for each remaining lot
      remainingLots.forEach(lot => {
        const remainingQuantity = lot.quantity - (lot.sellQuantity || 0);
        const marketValue = remainingQuantity * (lot.price || 0);
        const salesProceedsOrRedemptionAmountINR = (lot.sellQuantity || 0) * (lot.price || 0);
        
        // Use the findPeakPrice function to get the peak price and date
        const { price: peakPrice, date: peakPriceDate } = findPeakPrice(security.symbol, lot.date, calendarYearStart, calendarYearEnd);
        let peakValueINR = lot.cost;
        let peakValueDate = lot.date;
        if (peakPriceDate) {
          peakValueINR = peakPrice * remainingQuantity * getExchangeRate(peakPriceDate);
          peakValueDate = peakPriceDate;
        } 
        
        const holding: SecurityHolding = {
          symbol: security.symbol,
          securityName: security.securityName,
          address: 'xxxx',
          zipCode: 'xxxx',
          natureOfAsset: 'equity',
          dateOfAcquisition: lot.date,
          initialInvestmentINR: lot.cost,
          peakValueINR: peakValueINR,
          peakValueDate: peakValueDate,
          closingValueINR: marketValue,
          totalGrossAmountINR: marketValue,
          salesProceedsOrRedemptionAmountINR: salesProceedsOrRedemptionAmountINR
        };
        
        yearEndHoldings.push(holding);
      });
  
    });
    
    console.log(`\n===== SCHEDULE FA HOLDINGS =====`);
    const calendarYear = calendarYearStart.getFullYear();
    console.log(`Holdings that existed on December 31, ${calendarYear}: ${holdingsOnDecember31}`);
    console.log(`Holdings transacted within ${calendarYear}: ${transactedInCY}`);
    console.log(`Total holdings for Schedule FA: ${yearEndHoldings.length}`);
    
    return yearEndHoldings;
  } 

/**
 * Generates Schedule FA from security holdings
 * 
 * @param securityHoldings - Array of security holdings
 * @returns ScheduleFA object
 */
function generateScheduleFA(securityHoldings: SecurityHolding[]): ScheduleFA {
  // Map security holdings to DtlsForeignEquityDebtInterest array
  const foreignEquityDebtInterests = securityHoldings.map(holding => {
    // Format date as YYYY-MM-DD string for ITR format
    const dateOfAcquisition = holding.dateOfAcquisition.toISOString().split('T')[0];
    
    return {
      NameOfEntity: holding.symbol,
      AddressOfEntity: holding.address,
      ZipCode: holding.zipCode,
      CountryName: "United States", // Assuming Charles Schwab holdings are US-based
      CountryCodeExcludingIndia: "USA" as any, // Type assertion as CountryCodeExcludingIndia
      NatureOfEntity: holding.natureOfAsset,
      InterestAcquiringDate: dateOfAcquisition,
      InitialValOfInvstmnt: holding.initialInvestmentINR,
      PeakBalanceDuringPeriod: holding.peakValueINR,
      ClosingBalance: holding.closingValueINR,
      TotGrossAmtPaidCredited: holding.totalGrossAmountINR,
      TotGrossProceeds: holding.salesProceedsOrRedemptionAmountINR
    };
  });

  // Create and return the ScheduleFA object with the mapped holdings
  return {
    DtlsForeignEquityDebtInterest: foreignEquityDebtInterests
  };
} 