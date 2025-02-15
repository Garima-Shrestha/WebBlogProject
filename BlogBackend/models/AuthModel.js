import {pool} from '../config/db.js';

export const createUser = async (username, email, password, role) => {
    try {
      const query = `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;
      const values = [username, email, password, role];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error); // Log the full error for debugging
      throw new Error(process.env.NODE_ENV === 'production' ? 'Database error during user creation' : error.message);
    }
  };
export const findEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};



//For Managing Account i.e. deleting account
export const deleteAccount = async (userId) => {              //Deletes a user with the given userId from the users table and returns the deleted user's data.
  try{
  const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
  }catch (err) {
    console.error("Error deleting account", err);
    throw new Error("Could not delete account. Please try again.");
  }
}






// Admin le bloggers haru add, delete, update ra fetch garna milne
// Fetch
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


// Delete
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


// Update
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
  


// Add
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