import { getBloggerInfo } from '../models/BloggerProfileViewModel.js';

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