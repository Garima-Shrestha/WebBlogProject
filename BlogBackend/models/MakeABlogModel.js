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


export const getBlogById = async (id) => {
    try {
        const query = `SELECT * FROM blogs WHERE id = $1`;     //Blog table(make a blog page) bata id fetch garne 
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }catch (error) {
        console.error('Error retrieving blog:', error);
        throw new Error('Error retrieving blog');
    }
}


export const updateBlog = async (id, userId, title, content, bannerImage) => {
    try {
        const query = `
            UPDATE blogs 
            SET title = $2, content = $3, banner_image = $4 
            WHERE id = $1 AND user_id = $5 
            RETURNING *`;
        const values = [id, title, content, bannerImage, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating blog:', err);
        throw new Error('Error updating blog');
    }
}
