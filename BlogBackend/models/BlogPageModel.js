import { pool } from '../config/db.js';  

// // Naya Blog banauna
// export const createBlogPage = async (blogId, content) => {
//     try {
//         const query = `INSERT INTO blogPage (blog_id, content) VALUES ($1, $2) RETURNING *`;
//         const values = [blogId, content];
        
//         const result = await pool.query(query, values);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error creating blog page:', error);
//         throw new Error('Error creating blog page');
//     }
// };

// Get a blog page by blogId
export const getBlogPageByBlogId = async (blogId) => {
    try {
        const query = 'SELECT * FROM blogPage WHERE blog_id = $1';
        const result = await pool.query(query, [blogId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching blog page:', error);
        throw new Error('Error fetching blog page');
    }
};

// Publish bhayeko blog lai update garna
export const updateBlogPage = async (blogId, content) => {
    try {
        const query = 'UPDATE blogPage SET content = $1 WHERE blog_id = $2 RETURNING *';
        const values = [content, blogId];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating blog page:', error);
        throw new Error('Error updating blog page');
    }
};
