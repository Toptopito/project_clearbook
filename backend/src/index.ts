import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
