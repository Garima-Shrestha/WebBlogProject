import { createBlog, deleteBlog, getBlogById, updateBlog } from '../models/MakeABlogModel.js'; 
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

        const { title, content, bannerImage } = req.body; 


        if (!title || !content || !bannerImage) {
            return res.status(400).json({ message: 'Title, content, and banner image are required' });
        }

        // Database ma blog lai add garna
        const newBlog = await createBlog(userId, title, content, bannerImage);

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



//Id ko through blog fetch garnu
export const getBlog = async (req, res) => {
    try{
        const userId = req.user.id;
 
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }

        const fetchBlog = await getBlogById(id, userId);
        if (!fetchBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({message: 'Blog found successfully', fetchBlog});
    }catch (error) {
        console.error('Error retrieving blog:', error.message);
        res.status(500).json({ message: 'Error retrieving blog', error: error.message });
    }
}



//update lai handle garna
export const updateExistingBlog = async (req, res) => {
    try {
        const userId = req.user.id;

        const { id } = req.params;
        const { title, content, bannerImage } = req.body; 

        if (!id || !title || !content || !bannerImage) {
            return res.status(400).json({ message: 'Blog ID, title, content, and banner image are required' });
        }


        const blog = await getBlogById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const updatedBlog = await updateBlog(id, title, content, bannerImage, userId);

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