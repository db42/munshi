import React from 'react';
import { Itr } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { getNestedValue } from '../../../utils/helpers'; // Assuming utils file exists
import { ITRViewerStepConfig } from '../types';

interface CapitalGainsStepProps {
    itrData: Itr;
    config: ITRViewerStepConfig;
}

export const CapitalGainsStep: React.FC<CapitalGainsStepProps> = ({ itrData, config }) => {
    const cgData = itrData.ITR?.ITR2?.ScheduleCGFor23;
    const shortTermGains = cgData?.ShortTermCapGainFor23;
    const longTermGains = cgData?.LongTermCapGain23;

    const renderSTCGTable = (gainType: any, title: string, rate: string) => {
        if (!gainType || !getNestedValue(gainType, 'FullConsideration', 0)) return null;
        return (
            <TableRow>
                <TableCell>{title} ({rate})</TableCell>
                <TableCell className="text-right">{getNestedValue(gainType, 'FullConsideration', '-')}</TableCell>
                <TableCell className="text-right">{getNestedValue(gainType, 'DeductSec48.AquisitCost', '-')}</TableCell>
                <TableCell className="text-right">{getNestedValue(gainType, 'DeductSec48.ImproveCost', '-')}</TableCell>
                <TableCell className="text-right">{getNestedValue(gainType, 'DeductSec48.ExpOnTrans', '-')}</TableCell>
                <TableCell className="text-right">{getNestedValue(gainType, 'LossSec94of7Or94of8', '-')}</TableCell>
                <TableCell className="text-right font-semibold">{getNestedValue(gainType, 'BalanceCG', '-')}</TableCell>
            </TableRow>
        );
    };

     const renderLTCGTable = (gainType: any, title: string, rate: string) => {
        if (!gainType || !getNestedValue(gainType, 'FullConsideration', 0)) return null;
        // Determine if indexed cost is applicable (e.g., for Land/Building)
        const indexedCost = getNestedValue(gainType, 'DeductSec48.AquisitCostIndex');

        return (
            <TableRow>
                <TableCell>{title} ({rate})</TableCell>
                <TableCell className="text-right">{getNestedValue(gainType, 'FullConsideration', '-')}</TableCell>
                <TableCell className="text-right">{indexedCost !== undefined ? indexedCost : getNestedValue(gainType, 'DeductSec48.AquisitCost', '-')}</TableCell>
                <TableCell className="text-right">{indexedCost !== undefined ? 'N/A' : getNestedValue(gainType, 'DeductSec48.ImproveCost', '-')}</TableCell> {/*Improvement cost often indexed or handled differently*/}
                <TableCell className="text-right">{getNestedValue(gainType, 'DeductSec48.ExpOnTrans', '-')}</TableCell>
                <TableCell className="text-right">{getNestedValue(gainType, 'DeductionUs54F', '-')}</TableCell> {/* Section 54F Deduction */}
                <TableCell className="text-right font-semibold">{getNestedValue(gainType, 'BalanceCG', '-')}</TableCell>
            </TableRow>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Short Term Capital Gains (STCG)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset Type / Section</TableHead>
                                <TableHead className="text-right">Full Consideration</TableHead>
                                <TableHead className="text-right">Cost of Acquisition</TableHead>
                                <TableHead className="text-right">Cost of Improvement</TableHead>
                                <TableHead className="text-right">Expenditure</TableHead>
                                <TableHead className="text-right">Loss u/s 94</TableHead>
                                <TableHead className="text-right">Net Gain/Loss</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shortTermGains?.EquityMFonSTT?.map((item, index) => (
                                renderSTCGTable(item.EquityMFonSTTDtls, `Equity/MF (STT Paid - ${item.MFSectionCode})`, "15%")
                            ))}
                             {renderSTCGTable(shortTermGains?.SaleOnOtherAssets, 'Other Assets', 'App Rate')}
                             {renderSTCGTable(shortTermGains?.NRISecur115AD, 'NRI Securities 115AD', '30%')}
                             {/* Add rows for DTAA, Deemed STCG etc. if needed */}
                              <TableRow className="bg-muted font-medium">
                                <TableCell>Total STCG</TableCell>
                                <TableCell colSpan={5}></TableCell>
                                <TableCell className="text-right">{getNestedValue(shortTermGains, 'TotalSTCG', '-')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Long Term Capital Gains (LTCG)</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset Type / Section</TableHead>
                                <TableHead className="text-right">Full Consideration</TableHead>
                                <TableHead className="text-right">Cost (Indexed?)</TableHead>
                                <TableHead className="text-right">Improvement Cost</TableHead>
                                <TableHead className="text-right">Expenditure</TableHead>
                                <TableHead className="text-right">Exemption u/s 54F etc.</TableHead>
                                <TableHead className="text-right">Net Gain/Loss</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {longTermGains?.SaleofLandBuild?.SaleofLandBuildDtls?.map((item, index) => (
                                renderLTCGTable(item, `Land/Building ${index + 1}`, "20%")
                            ))}
                            {renderLTCGTable(longTermGains?.SaleofBondsDebntr, 'Bonds/Debentures', '10% / 20%')}
                            {renderLTCGTable(longTermGains?.SaleOfEquityShareUs112A, 'Equity Share 112A', '10% (>1L)')}
                            {renderLTCGTable(longTermGains?.SaleofAssetNA, 'Other Assets', '20%')}
                            {/* Add rows for NRI, Proviso 112, DTAA, Deemed LTCG etc. if needed */}
                             <TableRow className="bg-muted font-medium">
                                <TableCell>Total LTCG</TableCell>
                                <TableCell colSpan={5}></TableCell>
                                <TableCell className="text-right">{getNestedValue(longTermGains, 'TotalLTCG', '-')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Total Capital Gains</TableCell>
                                <TableCell className="text-right font-semibold">{getNestedValue(cgData, 'SumOfCGIncm', '-')}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Income from VDA Transfer</TableCell>
                                <TableCell className="text-right">{getNestedValue(cgData, 'IncmFromVDATrnsf', '-')}</TableCell>
                            </TableRow>
                            {/* Add rows for Set-offs if needed */}
                             <TableRow className="bg-muted font-semibold">
                                <TableCell>Income chargeable under Capital Gains</TableCell>
                                <TableCell className="text-right">{getNestedValue(cgData, 'TotScheduleCGFor23', '-')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
