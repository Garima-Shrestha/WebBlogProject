import { pool } from '../config/db.js';

export const getBloggerInfo = async (id) => {
    const query = `SELECT id, username, email FROM users`; 
    try {
        const result = await pool.query(query);
        return result.rows; 
    } catch (error) {
        console.error('Error fetching blogger info:', error);
        throw error;  
    }
};


export const deleteBloggerById = async (id) => {
    const query = `DELETE FROM users WHERE id = $1`; 
    try {
        const result = await pool.query(query, [id]);
        return result; 
    } catch (error) {
        console.error('Error deleting blogger:', error);
        throw error;  
    }
};
