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