import { createBlog } from '../models/MakeABlogModel.js'; 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;


// Middleware to verify the JWT token and extract the user ID
const verifyTokenAndGetUserId = (req) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, jwtSecret);
        return decoded.id; // User ID from JWT
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};



// Controller to handle blog creation
export const createNewBlog = async (req, res) => {
    try {
        const userId = verifyTokenAndGetUserId(req);

        const { title, content, bannerImage } = req.body; 


        if (!title || !content || !bannerImage) {
            return res.status(400).json({ message: 'Title, content, and banner image are required' });
        }

        // Database ma blog lai add garna
        const newBlog = await createBlog(userId, title, content, bannerImage);

        if (!newBlog) {
            return res.status(500).json({ message: 'Failed to create blog' });
        }

        res.status(201).json({message: 'Blog created successfully',});
    } catch (error) {
        console.error('Error creating blog:', error.message);
        res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
};