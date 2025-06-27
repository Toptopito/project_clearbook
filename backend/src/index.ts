import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import labResultRoutes from './routes/labResult.routes';
import profileRoutes from './routes/profile.routes';
import { notFoundHandler, errorHandler } from './middleware/error';
import swaggerSpec from './config/swagger';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Define port
const PORT = process.env.PORT || 5000;

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Hello World from Clearbook API!',
    project: 'Clearbook Personal Health Records',
    version: '0.1.0'
  });
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Mount lab result routes
app.use('/api/lab-results', labResultRoutes);

// Mount profile routes
app.use('/api/profile', profileRoutes);

// API Documentation with Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint to get the OpenAPI spec in JSON format
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Error handling middleware (must be after all other middleware and routes)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
