import express from 'express';
import { createBlogPageContent, getBlogPageContent, updateBlogPageContent } from '../controllers/BlogPageController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();


// router.post('/blog/create', authMiddleware, createBlogPageContent);
router.get('/blog/:blogId', authMiddleware, getBlogPageContent);
router.put('/blog/update', authMiddleware, updateBlogPageContent);

export default router;
