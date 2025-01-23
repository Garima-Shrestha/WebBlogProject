import pkg from 'pg';
const {Pool}= pkg;

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'webblogproject', 
    password: 'post123sql', 
    port: 5432, 
});

// //Code to CREATE DATABASE
// pool.query("CREATE DATABASE WebBlogProject")
//   .then(() => {
//     console.log("Database Created");
//   })
//   .catch((err) => {
//     console.log(err);
//   });


//Code to CREATE Table in database
export const createTable = async () => {
    try {
      const query = `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
        );
    `;
      await pool.query(query);
      console.log("Table created");
    } catch (err) {
      console.error("Error creating table", err);
    }
  };

// // Checking the connection and logging the database name
// pool.connect()
//     .then(client => {
//         console.log('Connected to database:', client.database); // Logs the database name
//         client.release(); // Don't forget to release the client after use
//     })
//     .catch(err => {
//         console.error('Connection error:', err.stack);
//     });


  
export {pool};