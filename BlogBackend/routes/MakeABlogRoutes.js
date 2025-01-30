import express from 'express';
import { createNewBlog } from "../controllers/MakeABlogController.js"
import authMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();



router.post('/makeblog/add', authMiddleware, createNewBlog);


export default router;
