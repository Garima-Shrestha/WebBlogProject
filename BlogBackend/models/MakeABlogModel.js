import {pool} from '../config/db.js';

export const createBlog = async(userId, email, title, content, bannerImage) => {
    try{
        const query = `INSERT INTO blogs (user_id, email, title, content, banner_image)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values =[userId, email, title, content, bannerImage];
        const result = await pool.query(query, values);
        return result.rows[0];
    }catch (err) {
        console.error('Error creating blog:', err);
        throw new Error('Error creating blog');
    }
}


export const getBlogById = async (id) => {
    try {
        const query = `
            SELECT blogs.*, users.email, blogs.user_id
            FROM blogs
            JOIN users ON blogs.user_id = users.id
            WHERE blogs.id = $1`
        ;                                                               //Blog table(make a blog page) bata 'id' fetch garne 
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }catch (error) {
        console.error('Error retrieving blog:', error);
        throw new Error('Error retrieving blog');
    }
}


export const updateBlog = async (id, title, content, bannerImage, userId, email) => {
    try {
        const query = `
            UPDATE blogs 
            SET title = $2, content = $3, banner_image = $4, email = $6
            WHERE id = $1 AND user_id = $5 
            RETURNING *`;
        const values = [id, title, content, bannerImage, userId, email];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating blog:', err.message);
        throw new Error('Error updating blog');
    }
}


export const deleteBlog = async (id, userId) => {
    try{
        const query = `DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING *`;
        const values = [id, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }catch(error){
        console.error('Error deleting blog:', error);
        throw new Error('Error deleting blog');
    }   
}



// Fetch all blogs(homepage ko lagi)
export const getAllBlogsWithAuthors = async () => {
    try {
        const query = `
            SELECT blogs.*, blogs.email
            FROM blogs
            ORDER BY blogs.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error fetching blogs:', err);
        throw new Error('Error fetching blogs');
    }
};






// Admin le blogs haru ko data lai delete garna milne
export const deleteBlogByAdmin = async (id) => {
    try {
        const query = `DELETE FROM blogs WHERE id = $1 RETURNING *`;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting blog:', error);
        throw new Error('Error deleting blog');
    }
};
