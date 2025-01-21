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


// //Code to CREATE Table in database
// const createTable = `CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
// );`
// pool.query(createTable)
//   .then(() => {
//     console.log("Table Created");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

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