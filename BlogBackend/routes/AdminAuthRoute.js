import express from 'express';
import { adminRegister, adminLogin } from '../controllers/AdminAuthController.js';

const router = express.Router();

// POST route to register a new user
router.post('/adminRegister', adminRegister);
router.post('/adminLogin', adminLogin);

export default router;
