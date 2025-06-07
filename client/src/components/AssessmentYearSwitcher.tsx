import React from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from 'lucide-react';

// Define props interface
interface AssessmentYearSwitcherProps {
  currentYear: string;
  onChange: (year: string) => void;
}

// Generate a list of assessment years
const generateAssessmentYears = (): string[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const years: string[] = [];
  for (let i = 0; i < 5; i++) {
    const startYear = currentYear - i;
    const endYear = (startYear + 1) % 100;
    years.push(`${startYear}-${endYear.toString().padStart(2, '0')}`);
  }
  return years;
};

const AssessmentYearSwitcher: React.FC<AssessmentYearSwitcherProps> = ({ currentYear, onChange }) => {
  const years = generateAssessmentYears();
  
  const handleYearChange = (year: string) => {
    if (year !== currentYear) {
      onChange(year);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>AY: {currentYear}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Switch Assessment Year</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {years.map((year) => (
          <DropdownMenuItem key={year} onClick={() => handleYearChange(year)}>
            {year}
            {year === currentYear && <span className="text-xs text-muted-foreground ml-2">(Current)</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssessmentYearSwitcher; 