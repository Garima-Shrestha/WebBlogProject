import express from 'express';
import cors from 'cors';
import AuthRoute from './routes/AuthRoute.js';   
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();

// Use CORS for cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json()); // Express has a built-in body parser for JSON

// Routes
app.use('/api/auth', AuthRoute); // Register routes from RegisterRoutes.js


export default app;
