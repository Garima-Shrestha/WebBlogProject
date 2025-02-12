import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import AuthRoute from './routes/AuthRoute.js';   
import {createTable, createCustomerTable, createBlogTable } from './config/db.js';
import HomePageRoute from './routes/HomePageRoutes.js';
import CustomerRoutes from './routes/CustomerProfileRoutes.js';
import MakeABlogRoutes from './routes/MakeABlogRoutes.js';
import BloggerProfileViewRoutes from './routes/BloggerProfileViewRoutes.js';


dotenv.config();
const app = express();

//Initializing the database
createTable();
createCustomerTable();
createBlogTable(); 





//Middleware
app.use(cors());  // Use CORS for cross-origin requests
app.use(bodyParser.json());    // Middleware to parse incoming JSON requests




// Routes
app.use('/api/auth', AuthRoute); 
app.use('/api/protected', HomePageRoute);
app.use('/api/customerProfile', CustomerRoutes);
app.use('/api/createblog', MakeABlogRoutes);
app.use('/api/bloggerprofileview', BloggerProfileViewRoutes);



export default app;
