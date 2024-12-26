export interface ConversionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Optional: Add more generator-specific types here