import { getBloggerInfo, deleteBloggerById, updateBloggerById, addBloggersByAdmin } from '../models/BloggerProfileViewModel.js';
import bcrypt from "bcrypt"


export const fetchBloggerInfo = async (req, res) => {
    try {
        const bloggers = await getBloggerInfo();
        if (!bloggers) {
            return res.status(404).json({ message: 'Bloggers Profile not found' });
        }

        res.json({message: 'Bloggers Profile fetched', bloggers}); 
    } catch (error) {
        console.error('Error in fetchBloggerInfo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const deleteBlogger = async (req, res) => {
    const bloggerId = req.params.id; // Get the ID from the request parameters
    try {
        const result = await deleteBloggerById(bloggerId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Blogger not found' });
        }
        res.status(200).json({ message: 'Blogger deleted successfully' });
    } catch (error) {
        console.error('Error deleting blogger:', error);
        res.status(500).json({ message: 'Error deleting blogger', error: error.message });
    }
};



export const updateBlogger = async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

  try {
    // If the request includes a password, hash it before updating
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await updateBloggerById(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};


export const addBlogger = async (req, res) => {
    const { username, email, password } = req.body; // Get data from request body

    try {
         const hashedPassword = await bcrypt.hash(password, 10);
         console.log('Hashed password:', hashedPassword); // Debugging
        const newBlogger = await addBloggersByAdmin(username, email, hashedPassword); // Call the model function to add the blogger
        res.status(201).json({ message: 'Blogger added successfully', blogger: newBlogger });
    } catch (error) {
        console.error('Error adding blogger:', error);
        res.status(500).json({ message: 'Error adding blogger', error: error.message });
    }
};