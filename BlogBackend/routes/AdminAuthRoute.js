import express from 'express';
import { adminRegister } from '../controllers/AdminAuthController.js';

const router = express.Router();

// // POST route to register a new user
router.post('/adminRegister', adminRegister);

export default router;
