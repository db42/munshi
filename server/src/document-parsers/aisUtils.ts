import { 
  AISData, 
  AISTdsTcsDetail, 
  AISTransactionLine, 
  AISTaxPaymentDetail, 
  AISSftDetail,
  AISSftBreakdownLine,
  AISDemandRefundDetail,
  AISOtherInformation
} from '../types/ais';

/**
 * Converts date strings to Date objects in the parsed AIS data
 * 
 * @param data - The parsed AIS data with string dates
 */
export function convertDateStringsToDates(data: AISData): void {
  // Convert taxpayer date fields
  if (data.taxpayerInfo?.dateOfBirth) {
    data.taxpayerInfo.dateOfBirth = new Date(data.taxpayerInfo.dateOfBirth);
  }
  
  // Convert TDS transaction dates
  if (data.tdsDetails) {
    data.tdsDetails.forEach((tds: AISTdsTcsDetail) => {
      if (tds.transactionBreakdown) {
        tds.transactionBreakdown.forEach((transaction: AISTransactionLine) => {
          if (transaction.dateOfPaymentCredit) {
            transaction.dateOfPaymentCredit = new Date(transaction.dateOfPaymentCredit);
          }
        });
      }
    });
  }
  
  // Convert TCS transaction dates (similar structure to TDS)
  if (data.tcsDetails) {
    data.tcsDetails.forEach((tcs: AISTdsTcsDetail) => {
      if (tcs.transactionBreakdown) {
        tcs.transactionBreakdown.forEach((transaction: AISTransactionLine) => {
          if (transaction.dateOfPaymentCredit) {
            transaction.dateOfPaymentCredit = new Date(transaction.dateOfPaymentCredit);
          }
        });
      }
    });
  }
  
  // Convert SFT breakdown dates
  if (data.sftDetails) {
    data.sftDetails.forEach((sft: AISSftDetail) => {
      if (sft.breakdown) {
        sft.breakdown.forEach((item: AISSftBreakdownLine) => {
          if (item.reportedOnDate) {
            item.reportedOnDate = new Date(item.reportedOnDate);
          }
        });
      }
    });
  }
  
  // Convert tax payment dates
  if (data.taxPaymentDetails) {
    data.taxPaymentDetails.forEach((payment: AISTaxPaymentDetail) => {
      if (payment.dateOfDeposit) {
        payment.dateOfDeposit = new Date(payment.dateOfDeposit);
      }
    });
  }
  
  // Convert demand/refund dates
  if (data.demandRefundDetails) {
    data.demandRefundDetails.forEach((item: AISDemandRefundDetail) => {
      if (item.date) {
        item.date = new Date(item.date);
      }
    });
  }
  
  // Convert dates in other information
  if (data.otherInformation) {
    data.otherInformation.forEach((info: AISOtherInformation) => {
      if (info.date) {
        info.date = new Date(info.date);
      }
    });
  }
} 