import {pool} from '../config/db.js';

export const createUser= async (userData) => {
    const { userName, email, password } = userData;
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
    const values = [userName, email, password];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];         // Return the created user
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
}
export const findUser=async(email)=>{
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    try{
        const result= await pool.query(query,values);
        console.log('Database result:', result); 
        return result ? result : { rows: [] };
    }catch(error) {
        console.error("Error finding user:", error);  
        throw error;
    }
}
