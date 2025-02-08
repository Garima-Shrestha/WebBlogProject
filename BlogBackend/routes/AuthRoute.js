import express from 'express';
import { register, login, deleteingAccount } from '../controllers/AuthController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();

// POST route to register a new user
router.post('/register', register);
router.post('/login',login);
router.delete('/deleteaccount', authMiddleware , deleteingAccount);

export default router;
