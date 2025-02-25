import {getCustomerByUserId, addCustomer, updateCustomer} from '../models/CustomerProfileModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator'; 
import xss from 'xss';

dotenv.config();
const jwtSecret=process.env.JWT_SECRET;


// // Middleware to verify the JWT token and extract the user ID
// const verifyTokenAndGetUserId = (req) => {
//     try{
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             res.status(401).json({ message: 'No token provided' });
//         }
//         const decoded = jwt.verify(token, jwtSecret);
//         return decoded.id; // User ID from JWT
//         } catch (error) {
//             res.status(401).json({ message: 'Invalid token' });
//         }
//   };


  // Customer data retrival herxa
export const getCustomer = async (req, res) => {
    try {
        // const userId = verifyTokenAndGetUserId(req);
        const userId = req.user.id; // Get user ID from the request

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
        // const userId = verifyTokenAndGetUserId(req);
        const userId = req.user.id; // Get user ID from the request

        let { firstName, lastName, address, dob, email, contact, gender } = req.body;

        
        // Sanitize input
        const sanitizedFirstName = xss(firstName);
        const sanitizedLastName = xss(lastName);
        const sanitizedAddress = xss(address);
        const sanitizedDob = xss(dob);
        const sanitizedEmail = xss(email);
        const sanitizedContact = xss(contact);
        const sanitizedGender = xss(gender);

        // Validation 
        if (!validator.isLength(sanitizedFirstName, { min: 1, max: 50 })) {
            return res.status(400).json({ error: 'First name must be between 1 and 50 characters' });
        }
        if (!validator.isLength(sanitizedLastName, { min: 1, max: 50 })) {
            return res.status(400).json({ error: 'Last name must be between 1 and 50 characters' });
        }
        if (!validator.isEmail(sanitizedEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (sanitizedContact && (!validator.isMobilePhone(sanitizedContact, 'any', { strictMode: false }) || sanitizedContact.length !== 10)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }
        const validGenders = ['Male', 'Female', 'Others'];
        if (!validGenders.includes(sanitizedGender)) {
            return res.status(400).json({ error: 'Invalid gender' });
        }

        const newCustomer = await addCustomer(userId, sanitizedFirstName, sanitizedLastName, sanitizedAddress, sanitizedDob, sanitizedEmail, sanitizedContact, sanitizedGender);
        
        
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

    try {
        // const userId = verifyTokenAndGetUserId(req);
        const userId = req.user.id; // Get user ID from the request

        console.log('User ID:', userId); 
        let { firstName, lastName, address, dob, email, contact, gender } = req.body;


        // Sanitize input
        const sanitizedFirstName = xss(firstName);
        const sanitizedLastName = xss(lastName);
        const sanitizedAddress = xss(address);
        const sanitizedDob = xss(dob);
        const sanitizedEmail = xss(email);
        const sanitizedContact = xss(contact);
        const sanitizedGender = xss(gender);

        // Validation
        if (!validator.isLength(sanitizedFirstName, { min: 1, max: 50 })) {
            return res.status(400).json({ error: 'First name must be between 1 and 50 characters' });
        }
        if (!validator.isLength(sanitizedLastName, { min: 1, max: 50 })) {
            return res.status(400).json({ error: 'Last name must be between 1 and 50 characters' });
        }
        if (!validator.isEmail(sanitizedEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (sanitizedContact && (!validator.isMobilePhone(sanitizedContact, 'any', { strictMode: false }) || sanitizedContact.length !== 10)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }
        const validGenders = ['Male', 'Female', 'Others'];
        if (!validGenders.includes(sanitizedGender)) {
            return res.status(400).json({ error: 'Invalid gender' });
        }



        const updatedCustomer = await updateCustomer(userId, sanitizedFirstName, sanitizedLastName, sanitizedAddress, sanitizedDob, sanitizedEmail, sanitizedContact, sanitizedGender);

        if (!updatedCustomer) {
            console.log('Customer not found'); 
            return res.status(404).json({ message: 'Customer not found' });
        }
        console.log('Customer updated successfully'); 
        res.json({ message: 'Customer profile updated successfully', updatedCustomer });
    } catch (error) {
        console.error('Error updating customer:', error.message); 
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};