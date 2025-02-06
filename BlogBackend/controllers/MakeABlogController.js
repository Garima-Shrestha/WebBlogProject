import { createBlog, deleteBlog, getBlogById, updateBlog, getAllBlogsWithAuthors } from '../models/MakeABlogModel.js'; 
// import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;


// // Middleware to verify the JWT token and extract the user ID
// const verifyTokenAndGetUserId = (req) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             res.status(401).json({ message: 'No token provided' });
//         }
//         const decoded = jwt.verify(token, jwtSecret);
//         return decoded.id; // User ID from JWT
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };



// Controller to handle blog creation
export const createNewBlog = async (req, res) => {
    try {
        const userId = req.user.id;   // Access userId from req.user
        const email = req.user.email;

        const { title, content, bannerImage } = req.body; 


        //validation
        if (!title || !content || !bannerImage || !email) {
            return res.status(400).json({ error: 'Title, content, banner image, and email are required' });
        }
        if (!title || title.length < 1 || title.length > 100) {
            return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
        }
        if (!content || content.length < 1) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }
        if (!bannerImage) {
            return res.status(400).json({ error: 'Banner image is required' });
        }
        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailCheck.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }


        // Database ma blog lai add garna
        const newBlog = await createBlog(userId, email, title, content, bannerImage);

        if (!newBlog) {
            return res.status(500).json({ message: 'Failed to create blog' });
        }

        // Return the full blog object
        res.status(201).json({message: 'Blog created successfully', blog:newBlog});
    } catch (error) {
        console.error('Error creating blog:', error.message);
        res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
};



// Id ko through blog fetch garnu
export const getBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }

        const fetchBlog = await getBlogById(id);
        if (!fetchBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        console.log("Fetched Blog Data:", fetchBlog);
        res.status(200).json({ message: 'Blog found successfully', fetchBlog });
    } catch (error) {
        console.error('Error retrieving blog:', error.message);
        res.status(500).json({ message: 'Error retrieving blog', error: error.message });
    }
};



//update lai handle garna
export const updateExistingBlog = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("User ID:", userId);

        const { id } = req.params;
        const { email, title, content, bannerImage } = req.body;

        //validation
        if (!id || !title || !content || !bannerImage || !email) {
            return res.status(400).json({ error: 'Blog ID, title, content, banner image, and email are required' });
        }
        if (!title || title.length < 1 || title.length > 100) {
            return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
        }
        if (!content || content.length < 1) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }
        if (!bannerImage) {
            return res.status(400).json({ error: 'Banner image is required' });
        }
        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailCheck.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }


        const blog = await getBlogById(id, userId); // Ensure userId is passed here
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const updatedBlog = await updateBlog(id, title, content, bannerImage, userId, email);

        if (!updatedBlog) {
            return res.status(500).json({ message: 'Failed to update blog' });
        }

       // Return the full updated blog object
        res.status(200).json({ message: 'Blog updated successfully', blog:updatedBlog});
    } catch (error) {
        console.error('Error updating blog:', error.message);
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
}

//Delete content
export const deleteBlogPageContent = async(req,res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }        
        
        console.log("Deleting the Blog content...");
        const deletedBlog = await deleteBlog(id, userId);

        if (!deletedBlog) {
            return res.status(404).json({message: 'Blog not found'});
        }

        res.status(200).json({message: 'Blog deleted successfully'});
    }catch(error){
        console.error('Error deleting blog:', error.message);
        res.status(500).json({ message: 'Error deleting blog page', error: error.message });
    }
}


//fetching all blogs homepage ko lagi
export const fetchAllBlogs = async (req, res) => {
    try {
        const blogs = await getAllBlogsWithAuthors();
        res.status(200).json({message: 'Fetching all blogs', blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
};