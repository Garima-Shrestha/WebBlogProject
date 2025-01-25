import express from 'express';
import cors from 'cors';
import AuthRoute from './routes/AuthRoute.js';   
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {createTable, createAdminTable} from './config/db.js';
import HomePageRoute from './routes/HomePageRoutes.js';
import AdminAuthRoutes from './routes/AdminAuthRoute.js'

dotenv.config();
const app = express();

//Initializing the database
createTable();
createAdminTable();

// Use CORS for cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Routes
app.use('/api/auth', AuthRoute); // Register routes from AuthgRoutes.js
app.use('/api/protected', HomePageRoute);
app.use('/api/authadmin', AdminAuthRoutes);


export default app;
