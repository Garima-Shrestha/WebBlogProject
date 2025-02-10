import { getBloggerInfo, deleteBloggerById } from '../models/BloggerProfileViewModel.js';

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