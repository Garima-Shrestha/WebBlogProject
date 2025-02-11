import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { fetchBloggerInfo, deleteBlogger, updateBlogger, addBlogger } from '../controllers/BloggerProfileViewController.js';

const router = express.Router();

router.get('/profileview', authMiddleware, fetchBloggerInfo);
router.delete('/profileview/delete/:id', authMiddleware, deleteBlogger);
router.put('/profileview/update/:id', authMiddleware, updateBlogger); 
router.post('/profileview/add', authMiddleware, addBlogger); 

export default router;