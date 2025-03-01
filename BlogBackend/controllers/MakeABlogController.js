import { createBlog, deleteBlog, getBlogById, updateBlog, getAllBlogsWithAuthors, deleteBlogByAdmin, getBlogsByUserId } from '../models/MakeABlogModel.js'; 
import multer from 'multer';
import path from 'path';
import xss from 'xss';


// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Append file extension
    }
  });
  
  const upload = multer({ storage: storage });


  


// Controller to handle blog creation
export const createNewBlog = async (req, res) => {
    try {
        const userId = req.user.id;   // Access userId from req.user
        const email = req.user.email;

        // Sanitize input
        const { title, content } = req.body; 
        const sanitizedTitle = xss(title);
        const sanitizedContent = xss(content);
        const bannerImage = req.file ? req.file.filename : null; // Get the uploaded file path

        
        // Validation
        if (!sanitizedTitle || !sanitizedContent || !bannerImage || !email) {
            return res.status(400).json({ error: 'Title, content, banner image, and email are required' });
        }
        if (sanitizedTitle.length < 1 || sanitizedTitle.length > 100) {
            return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
        }
        if (sanitizedContent.length < 1) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }
        if (!bannerImage) {
            return res.status(400).json({ error: 'Banner image is required' });
        }
        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailCheck.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }


        // Database ma blog lai add garna
        const newBlog = await createBlog(userId, email, sanitizedTitle, sanitizedContent, bannerImage);

        if (!newBlog) {
            return res.status(500).json({ message: 'Failed to create blog' });
        }

        // Return the full blog object
        res.status(201).json({message: 'Blog created successfully', blog:newBlog});
    } catch (error) {
        console.error('Error creating blog:', error.message);
        res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
};



// Id ko through blog fetch garnu
export const getBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }

        const fetchBlog = await getBlogById(id);
        if (!fetchBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        console.log("Fetched Blog Data:", fetchBlog);
        res.status(200).json({ message: 'Blog found successfully', fetchBlog });
    } catch (error) {
        console.error('Error retrieving blog:', error.message);
        res.status(500).json({ message: 'Error retrieving blog', error: error.message });
    }
};



//update lai handle garna
export const updateExistingBlog = async (req, res) => {
    try {
       const userId = req.user.id;
        console.log("User ID:", userId);

        const { id } = req.params;
        const { email, title, content } = req.body;
        const bannerImage = req.file ? req.file.filename : req.body.imageFile;
    
    
        // Sanitize input
        const sanitizedTitle = xss(title);
        const sanitizedContent = xss(content);

        // Validation
        if (!id || !sanitizedTitle || !sanitizedContent || !bannerImage || !email) {
            return res.status(400).json({ error: 'Blog ID, title, content, banner image, and email are required' });
        }
        if (sanitizedTitle.length < 1 || sanitizedTitle.length > 100) {
            return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
        }
        if (sanitizedContent.length < 1 || sanitizedContent === '<br>') {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }
        if (!bannerImage) {
            return res.status(400).json({ error: 'Banner image is required' });
        }
        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailCheck.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }


        const blog = await getBlogById(id, userId); // Ensure userId is passed here
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const finalBannerImage = req.file ? req.file.filename : blog.banner_image; // Use uploaded file or existing

        const updatedBlog = await updateBlog(id, sanitizedTitle, sanitizedContent, finalBannerImage, userId, email);


        if (!updatedBlog) {
            return res.status(500).json({ message: 'Failed to update blog' });
        }

       // Return the full updated blog object
        res.status(200).json({ message: 'Blog updated successfully', blog:updatedBlog});
    } catch (error) {
        console.error('Error updating blog:', error.message);
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
}

//Delete content
export const deleteBlogPageContent = async(req,res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }        
        
        console.log("Deleting the Blog content...");
        const deletedBlog = await deleteBlog(id, userId);

        if (!deletedBlog) {
            return res.status(404).json({message: 'Blog not found'});
        }

        res.status(200).json({message: 'Blog deleted successfully'});
    }catch(error){
        console.error('Error deleting blog:', error.message);
        res.status(500).json({ message: 'Error deleting blog page', error: error.message });
    }
}


//fetching all blogs homepage ko lagi
export const fetchAllBlogs = async (req, res) => {
    try {
        const blogs = await getAllBlogsWithAuthors();
        res.status(200).json({message: 'Fetching all blogs', blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
};






// Admin le blogs haru ko data lai delete garna milne
export const adminDeleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        // Call the deleteBlog function to delete the blog
        const deletedBlog = await deleteBlogByAdmin(id); 
        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully', deletedBlog });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




//Your Blog (blogger le aafule banayeko blog herna paune)
export const fetchUserBlogs = async (req, res) => {
    try {
        const userId = req.user.id; 
        const blogs = await getBlogsByUserId(userId); 
        res.status(200).json({ message: 'Fetching user blogs', blogs });
    } catch (error) {
        console.error('Error fetching user blogs:', error.message);
        res.status(500).json({ message: 'Error fetching user blogs', error: error.message });
    }
};