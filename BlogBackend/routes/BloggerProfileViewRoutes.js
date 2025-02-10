import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { fetchBloggerInfo } from '../controllers/BloggerProfileViewController.js';

const router = express.Router();

router.get('/profileview', authMiddleware, fetchBloggerInfo);


export default router;