import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SelfAssessmentTaxForm } from '../../forms/SelfAssessmentTaxForm';

export const EditTaxPaymentTab: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Edit Self-Assessment Tax Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <SelfAssessmentTaxForm />
      </CardContent>
    </Card>
  );
}; 