import React from 'react';
import { Itr } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ITRViewerStepConfig } from '../types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatAmount } from '../../../utils/formatters';

interface CapitalGainsStepProps {
    itrData: Itr;
    config: ITRViewerStepConfig;
}

export const CapitalGainsStep: React.FC<CapitalGainsStepProps> = ({ itrData, config }) => {
    const cgData = itrData.ITR?.ITR2?.ScheduleCGFor23;
    const shortTermGains = cgData?.ShortTermCapGainFor23;
    const longTermGains = cgData?.LongTermCapGain23;
    
    // Get total capital gains from Part B-TI
    const totalCapitalGains = itrData.ITR?.ITR2?.["PartB-TI"]?.CapGain?.TotalCapGains || 0;
    const shortTermTotal = itrData.ITR?.ITR2?.["PartB-TI"]?.CapGain?.ShortTerm?.TotalShortTerm || 0;
    const longTermTotal = itrData.ITR?.ITR2?.["PartB-TI"]?.CapGain?.LongTerm?.TotalLongTerm || 0;

    // Helper to determine if a section has data (avoid null rows)
    const hasData = (section: any): boolean => {
        return section !== undefined && section !== null && (
            (section.FullConsideration && parseFloat(section.FullConsideration) !== 0) ||
            (section.BalanceCG && parseFloat(section.BalanceCG) !== 0)
        );
    };

    const renderSTCGTable = (gainType: any, title: string, rate: string) => {
        if (!gainType || !hasData(gainType)) return null;
        
        const fullConsideration = gainType?.FullConsideration || 0;
        const acquisitionCost = gainType?.DeductSec48?.AquisitCost || 0;
        const improvementCost = gainType?.DeductSec48?.ImproveCost || 0;
        const expenditure = gainType?.DeductSec48?.ExpOnTrans || 0;
        const losses = gainType?.LossSec94of7Or94of8 || 0;
        const balanceGain = gainType?.BalanceCG || 0;

        return (
            <TableRow>
                <TableCell>{title} ({rate})</TableCell>
                <TableCell className="text-right">{formatAmount(fullConsideration)}</TableCell>
                <TableCell className="text-right">{formatAmount(acquisitionCost)}</TableCell>
                <TableCell className="text-right">{formatAmount(improvementCost)}</TableCell>
                <TableCell className="text-right">{formatAmount(expenditure)}</TableCell>
                <TableCell className="text-right">{formatAmount(losses)}</TableCell>
                <TableCell className="text-right font-semibold">
                    {parseFloat(String(balanceGain)) >= 0 ? 
                        formatAmount(balanceGain) : 
                        <span className="text-red-500">{formatAmount(balanceGain)}</span>
                    }
                </TableCell>
            </TableRow>
        );
    };

    const renderLTCGTable = (gainType: any, title: string, rate: string) => {
        if (!gainType || !hasData(gainType)) return null;
        
        // Determine if indexed cost is applicable (e.g., for Land/Building)
        const fullConsideration = gainType?.FullConsideration || 0;
        const indexedCost = gainType?.DeductSec48?.AquisitCostIndex;
        const acquisitionCost = gainType?.DeductSec48?.AquisitCost || 0;
        const improvementCost = gainType?.DeductSec48?.ImproveCost || 0;
        const expenditure = gainType?.DeductSec48?.ExpOnTrans || 0;
        const deduction = gainType?.DeductionUs54F || 0;
        const balanceGain = gainType?.BalanceCG || 0;

        return (
            <TableRow>
                <TableCell>{title} ({rate})</TableCell>
                <TableCell className="text-right">{formatAmount(fullConsideration)}</TableCell>
                <TableCell className="text-right">{indexedCost !== undefined ? formatAmount(indexedCost) : formatAmount(acquisitionCost)}</TableCell>
                <TableCell className="text-right">{indexedCost !== undefined ? 'N/A' : formatAmount(improvementCost)}</TableCell>
                <TableCell className="text-right">{formatAmount(expenditure)}</TableCell>
                <TableCell className="text-right">{formatAmount(deduction)}</TableCell>
                <TableCell className="text-right font-semibold">
                    {parseFloat(String(balanceGain)) >= 0 ? 
                        formatAmount(balanceGain) : 
                        <span className="text-red-500">{formatAmount(balanceGain)}</span>
                    }
                </TableCell>
            </TableRow>
        );
    };

    // Check if we have any capital gains data
    const hasCapitalGains = cgData && (
        (shortTermGains && (shortTermGains.TotalSTCG !== undefined || shortTermGains.EquityMFonSTT || shortTermGains.SaleOnOtherAssets)) ||
        (longTermGains && (longTermGains.TotalLTCG !== undefined || longTermGains.SaleofLandBuild || longTermGains.SaleofBondsDebntr))
    );

    if (!hasCapitalGains) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Capital Gains</AlertTitle>
                <AlertDescription>
                    No capital gains data found in this tax return.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <Alert variant="default" className="mb-4">
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Capital Gains</AlertTitle>
                <AlertDescription>
                    Income from transfer of capital assets during the financial year.
                    <div className="mt-2 font-medium">
                        Total Capital Gains: {formatAmount(totalCapitalGains)}
                    </div>
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Total Short Term Capital Gains</TableCell>
                                <TableCell className="text-right">{formatAmount(shortTermGains?.TotalSTCG)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Total Long Term Capital Gains</TableCell>
                                <TableCell className="text-right">{formatAmount(longTermGains?.TotalLTCG)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Income from VDA Transfer</TableCell>
                                <TableCell className="text-right">{formatAmount(cgData?.IncmFromVDATrnsf)}</TableCell>
                            </TableRow>
                            <Separator className="my-2" />
                            <TableRow className="bg-slate-100 font-semibold">
                                <TableCell>Income chargeable under Capital Gains</TableCell>
                                <TableCell className="text-right">{formatAmount(cgData?.TotScheduleCGFor23)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Tabs defaultValue="short-term" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="short-term" className="flex items-center">
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Short Term
                    </TabsTrigger>
                    <TabsTrigger value="long-term" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Long Term
                    </TabsTrigger>
                </TabsList>

                {/* Short Term Capital Gains Tab */}
                <TabsContent value="short-term" className="mt-0">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                                Short Term Capital Gains (STCG)
                                <Badge variant={parseFloat(String(shortTermTotal)) >= 0 ? "default" : "destructive"}>
                                    {formatAmount(shortTermTotal)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {shortTermGains ? (
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
                                            renderSTCGTable(item.EquityMFonSTTDtls, `Equity/MF (STT Paid - ${item.MFSectionCode || "15%"})`, "15%")
                                        ))}
                                        {renderSTCGTable(shortTermGains?.SaleOnOtherAssets, 'Other Assets', 'App Rate')}
                                        {renderSTCGTable(shortTermGains?.NRISecur115AD, 'NRI Securities 115AD', '30%')}
                                        {/* Property doesn't exist in the type definition - commenting out to fix linter error */}
                                        {/* {renderSTCGTable(shortTermGains?.SaleOfEquitySharePTI, 'Equity Share Pass-Through', '15%')} */}

                                        <TableRow className="bg-slate-100 font-medium">
                                            <TableCell>Total STCG</TableCell>
                                            <TableCell colSpan={5}></TableCell>
                                            <TableCell className="text-right">
                                                {parseFloat(String(shortTermGains?.TotalSTCG || 0)) >= 0 ? 
                                                    formatAmount(shortTermGains?.TotalSTCG) : 
                                                    <span className="text-red-500">{formatAmount(shortTermGains?.TotalSTCG)}</span>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : (
                                <Alert variant="default" className="bg-amber-50">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No Short Term Capital Gains</AlertTitle>
                                    <AlertDescription>
                                        No short term capital gains data found in this return.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Long Term Capital Gains Tab */}
                <TabsContent value="long-term" className="mt-0">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                                Long Term Capital Gains (LTCG)
                                <Badge variant={parseFloat(String(longTermTotal)) >= 0 ? "default" : "destructive"}>
                                    {formatAmount(longTermTotal)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {longTermGains ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Asset Type / Section</TableHead>
                                            <TableHead className="text-right">Full Consideration</TableHead>
                                            <TableHead className="text-right">Cost (Indexed?)</TableHead>
                                            <TableHead className="text-right">Improvement Cost</TableHead>
                                            <TableHead className="text-right">Expenditure</TableHead>
                                            <TableHead className="text-right">Exemption</TableHead>
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
                                        {/* Property doesn't exist in the type definition - commenting out to fix linter error */}
                                        {/* {renderLTCGTable(longTermGains?.SaleOfEquitySharePTI, 'Equity Share Pass-Through', '10%')} */}

                                        <TableRow className="bg-slate-100 font-medium">
                                            <TableCell>Total LTCG</TableCell>
                                            <TableCell colSpan={5}></TableCell>
                                            <TableCell className="text-right">
                                                {parseFloat(String(longTermGains?.TotalLTCG || 0)) >= 0 ? 
                                                    formatAmount(longTermGains?.TotalLTCG) : 
                                                    <span className="text-red-500">{formatAmount(longTermGains?.TotalLTCG)}</span>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : (
                                <Alert variant="default" className="bg-amber-50">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No Long Term Capital Gains</AlertTitle>
                                    <AlertDescription>
                                        No long term capital gains data found in this return.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </div>
    );
};
