import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/home', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to your Homepage' });
});

export default router;