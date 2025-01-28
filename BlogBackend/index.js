import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import AuthRoute from './routes/AuthRoute.js';   
import {createTable, createAdminTable, createCustomerTable} from './config/db.js';
import HomePageRoute from './routes/HomePageRoutes.js';
import AdminAuthRoutes from './routes/AdminAuthRoute.js'
import CustomerRoutes from './routes/CustomerProfileRoutes.js';


dotenv.config();
const app = express();

//Initializing the database
createTable();
createAdminTable();
createCustomerTable();

// Use CORS for cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());


app.use((req, res, next) => {
    console.log('Received request:', req.method, req.url);
    next();
});

// Routes
app.use('/api/auth', AuthRoute); // Register routes from AuthgRoutes.js
app.use('/api/protected', HomePageRoute);
app.use('/api/authadmin', AdminAuthRoutes);
app.use('/api/customerProfile', CustomerRoutes);



export default app;
