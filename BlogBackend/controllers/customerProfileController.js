import {getCustomerByUserId, addCustomer, updateCustomer} from '../models/CustomerProfileModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret=process.env.JWT_SECRET;


// Middleware to verify the JWT token and extract the user ID
const verifyTokenAndGetUserId = (req, res) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return null;
        }
        const decoded = jwt.verify(token, jwtSecret);
        console.log('Decoded JWT:', decoded); // Add this log to check if the user ID is correct
        return decoded.id; // User ID from JWT
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
            return null;
        }
  };


  // Customer data retrival herxa
export const getCustomer = async (req, res) => {
    try {
        const userId = verifyTokenAndGetUserId(req, res);

        const customer = await getCustomerByUserId(userId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer data', error: error.message });
    }
};



// Adding a new customer
export const addNewCustomer = async (req, res) => {
    try {
        const userId = verifyTokenAndGetUserId(req, res);

        const { firstName, lastName, address, dob, email, contact, gender } = req.body;

        const newCustomer = await addCustomer(userId, firstName, lastName, address, dob, email, contact, gender);

        if (!newCustomer) {
            return res.status(500).json({ error: 'Failed to add Customer Profile' });
          }

        res.status(201).json({ message: 'Customer Profile added successfully', newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error adding customer', error: error.message });
    }
};



// Updating an existing customer
export const updateCustomerDetails = async (req, res) => {
    console.log('updateCustomerDetails function invoked'); // Added this log

    try {
        const userId = verifyTokenAndGetUserId(req, res);
        if (!userId) return;

        console.log('User ID:', userId); // Log the user ID
        console.log('Request Body:', req.body); 
        const { firstName, lastName, address, dob, email, contact, gender } = req.body;

        console.log('Updating Customer with Data:', { firstName, lastName, address, dob, email, contact, gender }); // Log the update data

        const updatedCustomer = await updateCustomer(userId, firstName, lastName, address, dob, email, contact, gender);
        if (!updatedCustomer) {
            console.log('Customer not found'); 
            return res.status(404).json({ message: 'Customer not found' });
        }
        console.log('Customer updated successfully'); // Log if the customer is updated
        res.json({ message: 'Customer profile updated successfully', updatedCustomer });
    } catch (error) {
        console.error('Error updating customer:', error.message); // Log the error message
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};