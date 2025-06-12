import { type Itr2 } from '../../types/itr';

export function isEligibleForITR1(itr2: Itr2): boolean {
    // 1. Income Check (Must be <= 50 Lakhs)
    if (itr2['PartB-TI'].GrossTotalIncome > 5000000) {
        return false;
    }

    // 2. Income Source Checks (No Capital Gains, VDA, etc.)
    if (itr2.ScheduleCGFor23 && itr2.ScheduleCGFor23.TotScheduleCGFor23 > 0) {
        return false;
    }
    if (itr2.ScheduleVDA && itr2.ScheduleVDA.TotIncCapGain > 0) {
        return false;
    }

    // 3. House Property Check (Must be at most one)
    if (itr2.ScheduleHP?.PropertyDetails && itr2.ScheduleHP.PropertyDetails.length > 1) {
        return false;
    }

    // 4. No Carried Forward Losses
    // A simple check could be on the TotalLossCFSummary in ScheduleCFL
    if (itr2.ScheduleCFL?.TotalLossCFSummary?.LossSummaryDetail) {
        const { TotalHPPTILossCF, TotalLTCGPTILossCF, TotalSTCGPTILossCF, OthSrcLossRaceHorseCF } = itr2.ScheduleCFL.TotalLossCFSummary.LossSummaryDetail;
        if ((TotalHPPTILossCF || 0) > 0 || (TotalLTCGPTILossCF || 0) > 0 || (TotalSTCGPTILossCF || 0) > 0 || (OthSrcLossRaceHorseCF || 0) > 0) {
            return false;
        }
    }
    
    // 5. No Foreign Assets or Income
    if (itr2.ScheduleFA || itr2.ScheduleFSI) {
        return false;
    }

    // 6. Not a Director in a company
    if (itr2.PartA_GEN1.FilingStatus.CompDirectorPrvYrFlg && itr2.PartA_GEN1.FilingStatus.CompDirectorPrvYrFlg === 'Y') {
        return false;
    }

    // 7. Does not hold unlisted equity shares
    if (itr2.PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYrFlg === 'Y') {
        return false;
    }

    // ...TODO: add any other ITR-1 disqualification checks ...

    // If all checks pass, the user is eligible.
    return true;
} 