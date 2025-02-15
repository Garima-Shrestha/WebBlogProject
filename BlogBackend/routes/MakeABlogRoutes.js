import express from 'express';
import { createNewBlog, getBlog, updateExistingBlog, deleteBlogPageContent, fetchAllBlogs, adminDeleteBlog } from "../controllers/MakeABlogController.js"
import authMiddleware from '../middleware/AuthMiddleware.js';
import upload from '../middleware/upload.js';


const router = express.Router();



router.post('/makeblog/add', upload.single('imageFile'), authMiddleware, createNewBlog);
router.get('/makeblog/fetch/:id', authMiddleware, getBlog);
router.put('/makeblog/edit/:id', upload.single('imageFile'), authMiddleware, updateExistingBlog);
router.delete('/makeblog/delete/:id', authMiddleware, deleteBlogPageContent);
router.get('/makeblog/all', authMiddleware, fetchAllBlogs);   //homepage
router.delete('/makeblog/admin/delete/:id', authMiddleware, adminDeleteBlog);   //admin

export default router;
