import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documents';
import { ensureUploadDir } from './utils/ensureUploadDir';
import { logger } from './utils/logger';
import itrRoutes from './routes/itrRoutes';
import userInputRoutes from './routes/userInputRoutes';
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../prod.env') })

const createServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  const setupMiddleware = async () => {
    // Enable CORS for client application
    app.use(cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true // Allow credentials for cross-origin requests
    }));
    
    // Disable caching for all routes
    app.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      next();
    });
    
    app.use(express.json());
  };

  const setupRoutes = async () => {
    app.use('/api/documents', documentRoutes);
    app.use('/api/itr', itrRoutes);
    app.use('/api/user-inputs', userInputRoutes);


    // Basic route for testing
    app.get('/', (req, res) => {
      res.json({ message: 'Welcome to Munshi Tax Filing Server' });
    });
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  };

  const setupErrorHandling = () => {
    app.use((req, res) => {
      res.status(404).json({ message: 'Not Found' });
    });

    // app.use((err, req, res, next) => {
      // logger.error('Unhandled error:', err);
    //   res.status(500).json({ message: 'Internal Server Error' });
    // });
  };

  const setupProcessHandlers = (cleanup: () => Promise<void>) => {
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', reason);
    });

    ['SIGTERM', 'SIGINT'].forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`${signal} received. Shutting down gracefully...`);
        await cleanup();
        process.exit(0);
      });
    });
  };

  const cleanup = async () => {
    // Add cleanup logic here (close database connections, etc)
    logger.info('Cleanup completed');
  };

  const start = async () => {
    try {
      await ensureUploadDir();
      await setupMiddleware();
      await setupRoutes();
      // setupErrorHandling();
      setupProcessHandlers(cleanup);

      return new Promise<void>((resolve) => {
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
          resolve();
        });
      });
    } catch (error) {
      console.log('Failed to start server:', error);
      throw error;
    }
  };

  return { start };
};

// Start the server
const server = createServer();
server.start().catch(() => process.exit(1));