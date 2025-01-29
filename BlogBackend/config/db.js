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
        password TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
    `;
      await pool.query(query);
      console.log("Table created");
    } catch (err) {
      console.error("Error creating table", err);
    }
  };


export const createAdminTable = async () => {
    try {
        const query = `CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
    `;
      await pool.query(query);
      console.log("Admin Table created");
    } catch (err) {
      console.error("Error creating table", err);
    }
  };



  //For customer profile/details
  export const createCustomerTable = async () => {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          address TEXT,
          dob DATE,
          email VARCHAR(100) UNIQUE,
          contact VARCHAR(15),
          gender VARCHAR(10),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
      `;
      await pool.query(query);
      console.log("Customer Table created");
    } catch (err) {
      console.error("Error creating customer table", err);
    }
  };
  


  export const createBlogTable = async () => {
    try {
        const query = `CREATE TABLE IF NOT EXISTS blogs (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(100) NOT NULL,
            content TEXT NOT NULL,
            banner_image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        await pool.query(query);
        console.log("Blog Table created");
    } catch (err) {
        console.error("Error creating blog table", err);
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