import { createBlogPage, getBlogPageByBlogId, updateBlogPage } from '../models/BlogPageModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;


// Middleware to verify the JWT token and extract the user ID
const verifyTokenAndGetUserId = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.id;  // Save the user ID to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};


// // Blog page creation
// export const createBlogPageContent = async (req, res) => {
//     try {
//         const { blogId, content } = req.body;

//         if (!blogId || !content) {
//             return res.status(400).json({ message: 'Blog ID and content are required' });
//         }

//         const newBlogPage = await createBlogPage(blogId, content);

//         if (!newBlogPage) {
//             return res.status(500).json({ message: 'Failed to create blog page' });
//         }

//         res.status(201).json({ message: 'Blog page created successfully', blogPage: newBlogPage });
//     } catch (error) {
//         console.error('Error creating blog page:', error.message);
//         res.status(500).json({ message: 'Error creating blog page', error: error.message });
//     }
// };



// Retrive blog page content by blogId
export const getBlogPageContent = async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!blogId) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }

        const blogPage = await getBlogPageByBlogId(blogId);

        if (!blogPage.length) {
            return res.status(404).json({ message: 'Blog page not found' });
        }

        res.status(200).json({ message: 'Blog page fetched successfully', blogPage });
    } catch (error) {
        console.error('Error fetching blog page:', error.message);
        res.status(500).json({ message: 'Error fetching blog page', error: error.message });
    }
};


// Update content
export const updateBlogPageContent = async (req, res) => {
    try {
        const { blogId, content } = req.body;

        if (!blogId || !content) {
            return res.status(400).json({ message: 'Blog ID and content are required' });
        }

        const updatedBlogPage = await updateBlogPage(blogId, content);

        if (!updatedBlogPage) {
            return res.status(500).json({ message: 'Failed to update blog page' });
        }

        res.status(200).json({ message: 'Blog page updated successfully', blogPage: updatedBlogPage });
    } catch (error) {
        console.error('Error updating blog page:', error.message);
        res.status(500).json({ message: 'Error updating blog page', error: error.message });
    }
};