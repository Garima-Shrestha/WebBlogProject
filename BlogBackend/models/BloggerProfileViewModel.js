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


export const updateBloggerById = async (id, userData) => {
    const fields = [];
    const values = [];
    let paramIndex = 1;
  
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
  
    if (fields.length === 0) throw new Error("No fields to update");
  
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
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