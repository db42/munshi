import express from 'express';
import documentRoutes from './routes/documents';
import { ensureUploadDir } from './utils/ensureUploadDir';
import { logger } from './utils/logger';

const createServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  const setupMiddleware = async () => {
    app.use(express.json());
  };

  const setupRoutes = async () => {
    app.use('/api/documents', documentRoutes);

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