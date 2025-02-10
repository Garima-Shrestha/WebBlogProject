import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { getCustomer, addNewCustomer, updateCustomerDetails } from '../controllers/customerProfileController.js';

const router = express.Router();

router.get('/customer/:id', authMiddleware, getCustomer);
router.post('/customer/add', authMiddleware, addNewCustomer);
router.put('/customer/update/:id', authMiddleware, updateCustomerDetails);


export default router;
