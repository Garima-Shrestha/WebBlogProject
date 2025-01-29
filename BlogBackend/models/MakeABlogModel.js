import {pool} from '../config/db.js';

export const createBlog = async(userId, title, content, bannerImage) => {
    try{
        const query = `INSERT INTO blogs (user_id, title, content, banner_image)
        VALUES ($1, $2, $3, $4) RETURNING *`;
        const values =[userId, title, content, bannerImage];
        const result = await pool.query(query, values);
        return result.rows[0];
    }catch (err) {
        console.error('Error creating blog:', err);
        throw new Error('Error creating blog');
    }
}