/**
 * Environment configuration
 * 
 * This provides a central place to access all environment variables
 * and adds some validation/defaults.
 */

// Get the environment variables from Vite.
// `vite dev` will set the env variables from .env.development
// `vite build` will set the env variables from .env.production
const env = import.meta.env;

// Export a configuration object with typed values and defaults
export const config = {
  // API configuration
  api: {
    baseUrl: env.VITE_API_URL || '/api',
  },
  
  // Application info
  app: {
    mode: env.MODE || 'development',
    isDev: env.DEV === true,
    isProd: env.PROD === true,
  },
};

console.log(`Application running in ${config.app.mode} mode`);
console.log(`API URL: ${config.api.baseUrl}`); 