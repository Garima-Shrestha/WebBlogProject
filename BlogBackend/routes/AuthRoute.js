import express from 'express';
import { register, login, deleteingAccount } from '../controllers/AuthController.js';
import { fetchBloggerInfo, deleteBlogger, updateBlogger, addBlogger } from '../controllers/AuthController.js'
import authMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();

// POST route to register a new user
router.post('/register', register);
router.post('/login',login);
router.delete('/deleteaccount', authMiddleware , deleteingAccount);



// Admin le bloggers haru add, delete, update ra fetch garna milne
router.get('/profileview', authMiddleware, fetchBloggerInfo);
router.delete('/profileview/delete/:id', authMiddleware, deleteBlogger);
router.put('/profileview/update/:id', authMiddleware, updateBlogger); 
router.post('/profileview/add', authMiddleware, addBlogger); 

export default router;
