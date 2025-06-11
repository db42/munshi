import React, { useState, useEffect } from 'react';
import { ITRViewerStepConfig } from '../types';
import { Itr } from '../../../types/itr';
import { TaxRegimePreference, TaxRegimeComparison } from '../../../types/tax.types';
import { Calculator, AlertCircle } from 'lucide-react';
import { useUserInput } from '../context/UserInputContext';

interface TaxRegimeStepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
  taxRegimeComparison?: TaxRegimeComparison;
}

export const TaxRegimeStep: React.FC<TaxRegimeStepProps> = ({ config, taxRegimeComparison }) => {
    const { userInput, saveUserInputData } = useUserInput();
    const [selectedRegime, setSelectedRegime] = useState<TaxRegimePreference | null>(null);

    const recommendation = taxRegimeComparison?.recommendation;
    const savings = taxRegimeComparison?.savings ?? 0;
    const oldRegimeTax = taxRegimeComparison?.oldRegimeTax ?? 0;
    const newRegimeTax = taxRegimeComparison?.newRegimeTax ?? 0;
  
    useEffect(() => {
      // Pre-select the regime based on context or recommendation
      const initialRegime = userInput.generalInfoAdditions?.taxRegimePreference || recommendation;
      if (initialRegime) {
          setSelectedRegime(initialRegime);
      }
    }, [userInput, recommendation]);
  
    const handleSelection = (regime: TaxRegimePreference) => {
      const newUserData = {
        ...userInput,
        generalInfoAdditions: {
            ...userInput.generalInfoAdditions,
            taxRegimePreference: regime,
        },
      };
      saveUserInputData(newUserData);
    };
  
    if (!taxRegimeComparison) {
        return <div>Loading tax comparison...</div>
    }

  return (
    <div>
        <h2 className="text-xl font-semibold mb-4">{config.title}</h2>
        <div className="space-y-6">
        {/* Tax Comparison Results */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-2">
                <Calculator className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Recommendation: {recommendation} Tax Regime</h4>
                <p className="text-sm text-green-700 mt-1">
                  You can save ₹{savings.toLocaleString()} by choosing the{" "}
                  {recommendation?.toLowerCase()} tax regime
                </p>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-sm mb-2">Old Tax Regime</h5>
                <div className="space-y-1 text-xs">
                  {/* These values are illustrative. Real implementation would need more data from backend */}
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span>₹...</span> 
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span>₹...</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Tax Liability:</span>
                    <span>₹{oldRegimeTax.toLocaleString()}</span>
                  </div>
                </div>
              </div>
  
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-sm mb-2">New Tax Regime</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span>₹...</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span>₹...</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Tax Liability:</span>
                    <span>₹{newRegimeTax.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
        {/* Regime Selection Options */}
        <div className="space-y-4">
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedRegime === TaxRegimePreference.OLD
                ? "border-primary bg-primary/5"
                : recommendation === TaxRegimePreference.OLD
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleSelection(TaxRegimePreference.OLD)}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  selectedRegime === TaxRegimePreference.OLD ? "border-primary bg-primary" : "border-gray-300"
                }`}
              >
                {selectedRegime === TaxRegimePreference.OLD && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Old Tax Regime</h4>
                  {recommendation === TaxRegimePreference.OLD && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Recommended - Save ₹{savings.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Higher tax rates but with various deductions and exemptions available
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    <p>✓ Deductions under Section 80C (up to ₹1.5L)</p>
                    <p>✓ Section 80D - Health Insurance</p>
                    <p>✓ HRA exemption available</p>
                  </div>
                  <div>
                    <p>✓ Standard deduction of ₹50,000</p>
                    <p>✓ Section 24(b) - Home loan interest</p>
                    <p>✓ Various other deductions available</p>
                  </div>
                </div>
                {recommendation === TaxRegimePreference.OLD && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-800">
                    <strong>Why this is better for you:</strong> Your deductions significantly reduce your taxable
                    income, making the old regime more beneficial despite higher tax rates.
                  </div>
                )}
              </div>
            </div>
          </div>
  
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedRegime === TaxRegimePreference.NEW
                ? "border-primary bg-primary/5"
                : recommendation === TaxRegimePreference.NEW
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleSelection(TaxRegimePreference.NEW)}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  selectedRegime === TaxRegimePreference.NEW ? "border-primary bg-primary" : "border-gray-300"
                }`}
              >
                {selectedRegime === TaxRegimePreference.NEW && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">New Tax Regime</h4>
                  {recommendation === TaxRegimePreference.NEW && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Recommended - Save ₹{savings.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Lower tax rates but with limited deductions and exemptions
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    <p>✗ No deductions under Section 80C</p>
                    <p>✗ No Section 80D deductions</p>
                    <p>✗ No HRA exemption</p>
                  </div>
                  <div>
                    <p>✓ Standard deduction of ₹50,000 only</p>
                    <p>✓ Lower tax slabs</p>
                    <p>✓ Simplified tax calculation</p>
                  </div>
                </div>
                {recommendation === TaxRegimePreference.NEW && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-800">
                    <strong>Why this is better for you:</strong> Your limited deductions make the lower tax rates
                    of the new regime more beneficial, even without claiming traditional deductions.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
  
        {selectedRegime && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-3">
              <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">
                  {selectedRegime === TaxRegimePreference.OLD ? "Old Tax Regime Selected" : "New Tax Regime Selected"}
                </p>
                <p className="text-blue-700">
                  {selectedRegime === TaxRegimePreference.OLD
                    ? "You can claim various deductions. The subsequent steps will include relevant deduction sections."
                    : "You'll have limited deductions but lower tax rates. Some sections in the following steps may not apply to you."}
                </p>
              </div>
            </div>
          </div>
        )}
  
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Important Note</p>
              <p className="text-amber-700">
                This comparison is based on the details you've entered. You can always change your selection, and
                we'll recalculate your tax liability accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 