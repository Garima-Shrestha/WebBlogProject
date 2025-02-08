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
