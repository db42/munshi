// Simple logging utility

export interface ILogger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

// Define log levels (order matters for comparison)
const LOG_LEVELS = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

// Configuration for logger levels (can be externalized later)
// Example: { 'calculateScheduleBFLA': 'debug', 'default': 'info' }
// 'none' can be used to silence a logger
const loggerConfig: Record<string, LogLevel> = {
  default: (process.env.NODE_ENV === 'development' ? 'debug' : 'info') as LogLevel,
  // Add specific logger configurations here, e.g.:
  'scheduleCYLA': 'none',
  'scheduleCGPostProcessing': 'none',
  'charlesSchwabToITR': 'none',
  'usCGEquityToITR': 'none',
  // 'taxUtils': 'none',
  'currencyConverter': 'none',
  'parserTypes': 'none',
  'equityPriceUtils': 'none',
  // 'partBTTI': 'none',
  'calculateScheduleBFLA': 'none',
};

const getLogLevel = (name: string): LogLevel => {
  return loggerConfig[name] || loggerConfig.default || 'info';
};

const logWithTimestamp = (level: LogLevel, name: string, message: string, ...args: any[]) => {
  const configuredLevel = getLogLevel(name);
  if (LOG_LEVELS[level] > LOG_LEVELS[configuredLevel]) {
    return; // Don't log if the message level is higher than configured level
  }

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}] [${name}]`;

  if (args.length > 0) {
    const argsString = args.map(arg => {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return '[UnserializableObject]';
      }
    }).join(', ');
    console.log(prefix, message, argsString);
  } else {
    console.log(prefix, message);
  }
};

const createLogger = (name: string): ILogger => {
  return {
    info: (message: string, ...args: any[]) => {
      logWithTimestamp('info', name, message, ...args);
    },
    error: (message: string, ...args: any[]) => {
      logWithTimestamp('error', name, message, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      logWithTimestamp('warn', name, message, ...args);
    },
    debug: (message: string, ...args: any[]) => {
      logWithTimestamp('debug', name, message, ...args);
    },
  };
};

export const getLogger = (name: string): ILogger => {
  return createLogger(name);
};

// Default logger instance for convenience (optional, could be removed)
export const logger: ILogger = getLogger('default');

// Usage examples:
// import { getLogger } from './logger';
// const bflaLogger = getLogger('calculateScheduleBFLA');
// bflaLogger.info('Processing BFLA');
// bflaLogger.debug('Detailed step', { detail: 'value' });

// To configure log levels, modify loggerConfig or load it externally.
// For example, to silence 'calculateScheduleBFLA' logs:
// loggerConfig['calculateScheduleBFLA'] = 'none';