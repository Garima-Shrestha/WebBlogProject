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