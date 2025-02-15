import { createComment, getCommentsByBlogId } from '../models/CommentModel.js';

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