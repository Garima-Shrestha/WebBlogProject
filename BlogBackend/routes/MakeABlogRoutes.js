import express from 'express';
import { createNewBlog } from "../controllers/MakeABlogController.js"
import authMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();



router.post('/makeblog/add', authMiddleware, createNewBlog);

// router.get('/makeblog', authMiddleware, getBlogs);
// router.put('makeblog/update/:id', authMiddleware, updateBlog);
// router.delete('/makeblog/delete/:id', authMiddleware, deleteBlog);

export default router;
