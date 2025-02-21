import { pool } from '../config/db.js';

export const createComment = async (blogId, userName, comment) => {
    const query = 'INSERT INTO comments (blog_id, user_name, comment) VALUES ($1, $2, $3) RETURNING *';
    const values = [blogId, userName, comment];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getCommentsByBlogId = async (blogId) => {
    const query = 'SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at DESC';
    const values = [blogId];
    const result = await pool.query(query, values);
    return result.rows;
};



// Admin le comment herna milxa
// Fetch
export const getAllCommentsByAdmin = async () => {
    const query = `
        SELECT comments.id, comments.user_name, comments.comment, blogs.title AS blog_title
        FROM comments
        JOIN blogs ON comments.blog_id = blogs.id
        ORDER BY comments.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};



// Delete
export const deleteCommentByAdmin = async (id) => {
   try {
        const query = `DELETE FROM comments WHERE id = $1 RETURNING *`;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw new Error('Error deleting comment');
    }
};