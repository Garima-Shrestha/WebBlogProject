import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import AuthRoute from './routes/AuthRoute.js';   
import {createTable, createCustomerTable, createBlogTable, createCommentsTable } from './config/db.js';
import HomePageRoute from './routes/HomePageRoutes.js';
import CustomerRoutes from './routes/CustomerProfileRoutes.js';
import MakeABlogRoutes from './routes/MakeABlogRoutes.js';
import CommentRoutes from './routes/CommentRoute.js';


import path from 'path';  // Import path to handle static files
import { fileURLToPath } from 'url';  // Import to use fileURLToPath
import { dirname } from 'path';  // Import to use dirname



dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();



//Initializing the database
createTable();
createCustomerTable();
createBlogTable(); 
createCommentsTable();




// Serve static files from the 'uploads' directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log("Uploads directory:", uploadsPath);
app.use('/uploads', express.static(uploadsPath)); // This line serves the static files




//Middleware
app.use(cors());  // Use CORS for cross-origin requests
app.use(bodyParser.json());    // Middleware to parse incoming JSON requests




// Routes
app.use('/api/auth', AuthRoute); 
app.use('/api/protected', HomePageRoute);
app.use('/api/customerProfile', CustomerRoutes);
app.use('/api/createblog', MakeABlogRoutes);
app.use('/api/bloggercomment', CommentRoutes);



export default app;
