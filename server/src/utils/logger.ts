// Simple logging utility

const logWithTimestamp = (level: string, message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    
    if (args.length > 0) {
      console.log(prefix, message, ...args);
    } else {
      console.log(prefix, message);
    }
  };
  
  export const logger = {
    info: (message: string, ...args: any[]) => {
      logWithTimestamp('INFO', message, ...args);
    },
    
    error: (message: string, ...args: any[]) => {
      logWithTimestamp('ERROR', message, ...args);
    },
    
    warn: (message: string, ...args: any[]) => {
      logWithTimestamp('WARN', message, ...args);
    },
    
    debug: (message: string, ...args: any[]) => {
      if (process.env.NODE_ENV === 'development') {
        logWithTimestamp('DEBUG', message, ...args);
      }
    }
  };
  
  // Usage examples:
  // logger.info('Server started');
  // logger.error('Failed to connect', { error: 'Connection refused' });
  // logger.debug('Request payload', requestBody);