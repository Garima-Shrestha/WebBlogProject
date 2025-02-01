import express from 'express';
import { createNewBlog, getBlog, updateExistingBlog } from "../controllers/MakeABlogController.js"
import authMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();



router.post('/makeblog/add', authMiddleware, createNewBlog);
router.get('/makeblog/fetch/:id', authMiddleware, getBlog);
router.put('/makeblog/edit/:id', authMiddleware, updateExistingBlog);

export default router;
