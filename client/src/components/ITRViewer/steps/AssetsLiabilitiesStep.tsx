import React from 'react';
import { ITRViewerStepConfig } from '../types';
import { Itr } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home, Wallet, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '../../../utils/formatters';
import _ from 'lodash';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const AssetsLiabilitiesStep: React.FC<StepProps> = ({ itrData, config }) => {
  // Extract data from itrData
  const scheduleAL = itrData.ITR?.ITR2?.ScheduleAL;
  
  // Check if we have any Assets & Liabilities data
  const hasData = !_.isNil(scheduleAL);
  
  if (!hasData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Assets & Liabilities Data</AlertTitle>
        <AlertDescription>
          No assets and liabilities data found in this tax return.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate total assets value
  const movableAssetsTotal = scheduleAL.MovableAsset ? (
    scheduleAL.MovableAsset.CashInHand +
    scheduleAL.MovableAsset.DepositsInBank +
    scheduleAL.MovableAsset.SharesAndSecurities +
    scheduleAL.MovableAsset.InsurancePolicies +
    scheduleAL.MovableAsset.LoansAndAdvancesGiven +
    scheduleAL.MovableAsset.JewelleryBullionEtc +
    scheduleAL.MovableAsset.ArchCollDrawPaintSulpArt +
    scheduleAL.MovableAsset.VehiclYachtsBoatsAircrafts
  ) : 0;
  
  // Calculate total immovable assets
  const immovableAssetsTotal = scheduleAL.ImmovableDetails ? 
    scheduleAL.ImmovableDetails.reduce((total, property) => total + property.Amount, 0) : 0;
  
  // Total assets
  const totalAssets = movableAssetsTotal + immovableAssetsTotal;
  
  // Total liabilities
  const totalLiabilities = scheduleAL.LiabilityInRelatAssets || 0;
  
  // Net worth
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <Wallet className="h-4 w-4" />
        <AlertTitle>Assets & Liabilities</AlertTitle>
        <AlertDescription>
          Review your assets and liabilities as reported in your ITR.
          <div className="mt-2 font-medium flex gap-4 flex-wrap">
            <span>Total Assets: {formatAmount(totalAssets)}</span>
            <span>Total Liabilities: {formatAmount(totalLiabilities)}</span>
            <span>Net Worth: {formatAmount(netWorth)}</span>
          </div>
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="movable-assets" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="movable-assets" className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Movable Assets
          </TabsTrigger>
          <TabsTrigger value="immovable-assets" className="flex items-center" disabled={!scheduleAL.ImmovableDetails || scheduleAL.ImmovableDetails.length === 0}>
            <Home className="h-4 w-4 mr-2" />
            Immovable Properties
          </TabsTrigger>
          <TabsTrigger value="liabilities" className="flex items-center" disabled={totalLiabilities === 0}>
            <CreditCard className="h-4 w-4 mr-2" />
            Liabilities
          </TabsTrigger>
        </TabsList>

        {/* Movable Assets Tab */}
        <TabsContent value="movable-assets" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Movable Assets
                <Badge>
                  Total: {formatAmount(movableAssetsTotal)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduleAL.MovableAsset ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Type</TableHead>
                      <TableHead className="text-right">Value (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Cash in Hand</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.CashInHand)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Deposits in Bank</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.DepositsInBank)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Shares and Securities</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.SharesAndSecurities)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Insurance Policies</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.InsurancePolicies)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Loans and Advances Given</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.LoansAndAdvancesGiven)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jewellery, Bullion, etc.</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.JewelleryBullionEtc)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Archaeological Collections, Drawings, Paintings, Sculptures, Art Work</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.ArchCollDrawPaintSulpArt)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Vehicles, Yachts, Boats, Aircraft</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleAL.MovableAsset.VehiclYachtsBoatsAircrafts)}</TableCell>
                    </TableRow>
                    <Separator className="my-2" />
                    <TableRow className="bg-slate-100 font-semibold">
                      <TableCell>Total Movable Assets</TableCell>
                      <TableCell className="text-right">{formatAmount(movableAssetsTotal)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <Alert variant="default" className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Movable Assets Data</AlertTitle>
                  <AlertDescription>
                    No movable assets data found in this return.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Immovable Properties Tab */}
        {scheduleAL.ImmovableDetails && scheduleAL.ImmovableDetails.length > 0 && (
          <TabsContent value="immovable-assets" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Immovable Properties
                  <Badge>
                    Total: {formatAmount(immovableAssetsTotal)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scheduleAL.ImmovableDetails.map((property, index) => (
                    <div key={index} className="p-4 border rounded-md mb-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{property.Description || `Property ${index + 1}`}</h4>
                        <Badge>{formatAmount(property.Amount)}</Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        {property.AddressAL.ResidenceNo && property.AddressAL.ResidenceName && (
                          <div>{property.AddressAL.ResidenceNo}, {property.AddressAL.ResidenceName}</div>
                        )}
                        {property.AddressAL.RoadOrStreet && property.AddressAL.LocalityOrArea && (
                          <div>{property.AddressAL.RoadOrStreet}, {property.AddressAL.LocalityOrArea}</div>
                        )}
                        <div>
                          {property.AddressAL.CityOrTownOrDistrict}
                          {property.AddressAL.PinCode && ` - ${property.AddressAL.PinCode}`}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center p-2 font-semibold">
                    <span>Total Immovable Assets</span>
                    <span>{formatAmount(immovableAssetsTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Liabilities Tab */}
        {totalLiabilities > 0 && (
          <TabsContent value="liabilities" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Liabilities
                  <Badge variant="destructive">
                    Total: {formatAmount(totalLiabilities)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Value (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Liabilities in Relation to Assets</TableCell>
                      <TableCell className="text-right">{formatAmount(totalLiabilities)}</TableCell>
                    </TableRow>
                    <Separator className="my-2" />
                    <TableRow className="bg-slate-100 font-semibold">
                      <TableCell>Total Liabilities</TableCell>
                      <TableCell className="text-right">{formatAmount(totalLiabilities)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-6 pt-4 border-t">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Value (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Assets</TableCell>
                        <TableCell className="text-right">{formatAmount(totalAssets)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Liabilities</TableCell>
                        <TableCell className="text-right">{formatAmount(totalLiabilities)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-slate-100 font-semibold">
                        <TableCell>Net Worth (Assets - Liabilities)</TableCell>
                        <TableCell className="text-right">{formatAmount(netWorth)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}; 