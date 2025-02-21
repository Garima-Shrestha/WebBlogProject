import { createComment, getCommentsByBlogId, getAllCommentsByAdmin, deleteCommentByAdmin } from '../models/CommentModel.js';

export const postComment = async (req, res) => {
    const { blogId, userName, comment } = req.body;

    if (!userName || !comment) {
        return res.status(400).json({ error: 'User  name and comment are required.' });
    }

    try {
        const newComment = await createComment(blogId, userName, comment);
        return res.status(201).json(newComment);
    } catch (error) {
        console.error('Error posting comment:', error);
        return res.status(500).json({ error: 'An error occurred while posting the comment.' });
    }
};

export const getComments = async (req, res) => {
    const { blogId } = req.params;

    try {
        const comments = await getCommentsByBlogId(blogId);
        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: 'An error occurred while fetching comments.' });
    }
};




// Admin le comment herna milxa
// Fetch
export const getAllComments = async (req, res) => {
    try {
        const comments = await getAllCommentsByAdmin();
        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: 'An error occurred while fetching comments.' });
    }
};



// Delete
export const adminDeleteComment = async (req, res) => {
    const { id } = req.params; 

    try {
        const deletedCount = await deleteCommentByAdmin(id);
        
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        return res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the comment.' });
    }
};
