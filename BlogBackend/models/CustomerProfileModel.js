import { pool } from '../config/db.js';

// Fetch customer data
export const getCustomerByUserId = async (userId) => {
  const query = `SELECT * FROM customers WHERE user_id = $1`;
  const values = [userId];

  try{
    const result = await pool.query(query, values);
    return result.rows[0];
  }catch(error){
    console.error('Database query error:', error.message);
    throw new Error('Could not fetch customer.');
  }
};


  // Add a new customer
export const addCustomer = async (userId, firstName, lastName, address, dob, email, contact, gender) => {
    const query = `
      INSERT INTO customers (user_id, first_name, last_name, address, dob, email, contact, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [userId, firstName, lastName, address, dob, email, contact, gender];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding customer:', error.message);
      throw new Error('Could not add customer.');
    }
  };
  

  // Update an existing customer
export const updateCustomer = async (userId, firstName, lastName, address, dob, email, contact, gender) => {
    const query = `
      UPDATE customers
      SET first_name = $2, last_name = $3, address = $4, dob = $5, email = $6, contact = $7, gender = $8
      WHERE user_id = $1
      RETURNING *;
    `;
  
    const values = [userId, firstName, lastName, address, dob, email, contact, gender];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating customer:', error.message);
      throw new Error('Could not update customer.');
    }
  };