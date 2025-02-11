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


export const updateBloggerById = async (id, username, email, password) => {
    const query = `
        UPDATE users
        SET username = $1, email = $2, password = $3
        WHERE id = $4
        RETURNING id, username, email
    `; 
    try {
        const result = await pool.query(query, [username, email, password, id]);
        return result;
    } catch (error) {
        console.error('Error updating blogger:', error);
        throw error;
    }
};



export const addBloggersByAdmin = async (username, email, password) => {
    const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email
    `;
    try {
        const result = await pool.query(query, [username, email, password]);
        return result.rows[0]; // Return the newly added blogger
    } catch (error) {
        console.error('Error adding blogger to DB:', error);
        throw error;  
    }
};