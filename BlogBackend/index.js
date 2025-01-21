import express from 'express';
import cors from 'cors';
import router from './routes/RegisterRoutes.js';   
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Use CORS for cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json()); // Express has a built-in body parser for JSON

// Routes
app.use('/api', router); // Register routes from RegisterRoutes.js


export default app;
