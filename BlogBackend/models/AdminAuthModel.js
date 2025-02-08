import {pool} from '../config/db.js';

export const createAdmin = async (adminName, adminEmail, adminPassword, role) => {
    try {
      const query = `INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;
      const values = [adminName, adminEmail, adminPassword, role];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating admin:', error); // Log the full error for debugging
      throw new Error(process.env.NODE_ENV === 'production' ? 'Database error during admin creation' : error.message);
    }
  };
export const findAdminEmail = async (adminEmail) => {
  const query = `SELECT * FROM admin WHERE email = $1;`;
  const { rows } = await pool.query(query, [adminEmail]);
  return rows[0];
};
