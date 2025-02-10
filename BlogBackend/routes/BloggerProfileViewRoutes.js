import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { fetchBloggerInfo, deleteBlogger } from '../controllers/BloggerProfileViewController.js';

const router = express.Router();

router.get('/profileview', authMiddleware, fetchBloggerInfo);
router.delete('/profileview/delete/:id', authMiddleware, deleteBlogger);


export default router;