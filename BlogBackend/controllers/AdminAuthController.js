import {createAdmin, findAdminEmail} from '../models/AdminAuthModel.js';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';  
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret=process.env.JWT_SECRET;

export const adminRegister= async (req, res) => {

    const { adminName, adminEmail, adminPassword } = req.body;

    try {
        console.log('Checking if admin exists...');
        const existingAdmin = await findAdminEmail(adminEmail);
    
        if (existingAdmin) {
          console.log('Admin exists: ', existingAdmin);
          return res.status(400).json({ error: 'Email already exists' });
        }
    
        console.log('Creating new admin...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = await createAdmin(adminName, adminEmail, hashedPassword);
    
        console.log('Admin created: ', newAdmin);
        
        if (!newAdmin) {
          console.log('Failed to create admin');
          return res.status(500).json({ error: 'Failed to create admin' });
        }
    
        console.log('Generating JWT...');
        const token = jwt.sign(
          { id: newAdmin.id, email: newAdmin.adminEmail }, 
          jwtSecret, 
          { expiresIn: '24h' }
        );
    
        console.log('Sending response...');
        res.status(201).json({ message: 'Admin created successfully', token });
    
      } catch (error) {
        console.error('Admin Signup error:', error); // Logs full error details
        res.status(500).json({ error: 'Server error', details: error.message });
      }
    };