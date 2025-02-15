import express from 'express';
import { postComment, getComments } from '../controllers/CommentController.js';

const router = express.Router();


router.post('/comments', postComment);
router.get('/comments/:blogId', getComments);

export default router;