import express from 'express';
import { postComment, getComments, getAllComments, adminDeleteComment } from '../controllers/CommentController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();


router.post('/comments', authMiddleware, postComment);
router.get('/comments/:blogId', authMiddleware, getComments);
router.get('/admin/comments', authMiddleware, getAllComments);   // Admin le comment herna milxa
router.delete('/admin/delete/:id', authMiddleware, adminDeleteComment);   //admin


export default router;