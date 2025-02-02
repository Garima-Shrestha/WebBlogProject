import express from 'express';
import { createNewBlog, getBlog, updateExistingBlog, deleteBlogPageContent } from "../controllers/MakeABlogController.js"
import authMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();



router.post('/makeblog/add', authMiddleware, createNewBlog);
router.get('/makeblog/fetch/:id', authMiddleware, getBlog);
router.put('/makeblog/edit/:id', authMiddleware, updateExistingBlog);
router.delete('/makeblog/delete/:id', authMiddleware, deleteBlogPageContent);

export default router;
