import React from 'react';
import { Input } from '../input';
import { Label } from '../label';

// Reusable Currency Input
export const CurrencyInput: React.FC<{
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  id: string;
  error?: string;
  placeholder?: string;
}> = ({ label, value, onChange, id, error, placeholder = '0' }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="0"
        step="1"
        value={value === undefined ? '' : value}
        onChange={(e) => {
          const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
          onChange(val);
        }}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Reusable Date Input
export const DateInput: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  id: string;
  error?: string;
}> = ({ label, value, onChange, id, error }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Reusable Text Input
export const TextInput: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  id: string;
  error?: string;
  placeholder?: string;
}> = ({ label, value, onChange, id, error, placeholder }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}; 