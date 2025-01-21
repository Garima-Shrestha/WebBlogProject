import express from 'express';
import { register } from '../controllers/RegisterController.js';


const router = express.Router();

// POST route to register a new user
router.post('/register', register);

export default router;
