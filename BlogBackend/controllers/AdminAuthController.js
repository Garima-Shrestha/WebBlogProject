import {createAdmin, findAdminEmail} from '../models/AdminAuthModel.js';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';  
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret=process.env.JWT_SECRET;

export const adminRegister= async (req, res) => {

    const { adminName, adminEmail, adminPassword, role='admin' } = req.body;

    //validation
    const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!adminEmail || !emailCheck.test(adminEmail)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!adminPassword || adminPassword.length < 8 || adminPassword.length > 16) {
      return res.status(400).json({ error: 'Password must be between 8 and 16 characters' });
    }


    try {
        console.log('Checking if admin exists...');
        const existingAdmin = await findAdminEmail(adminEmail);
    
        if (existingAdmin) {
          console.log('Admin exists: ', existingAdmin);
          return res.status(400).json({ error: 'Email already exists' });
        }
    
        console.log('Creating new admin...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = await createAdmin(adminName, adminEmail, hashedPassword, role);
    
        console.log('Admin created: ', newAdmin);
        
        if (!newAdmin) {
          console.log('Failed to create admin');
          return res.status(500).json({ error: 'Failed to create admin' });
        }
    
        console.log('Generating JWT...');
        const token = jwt.sign(
          { id: newAdmin.id, email: newAdmin.adminEmail, role:newAdmin.role  }, 
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

//login
    export const adminLogin = async (req, res) => {
      const { adminEmail, adminPassword } = req.body;

      //validation
      const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!adminEmail || !emailCheck.test(adminEmail)) {
          return res.status(400).json({ error: 'Invalid email format' });
      }
      if (!adminPassword || adminPassword.length < 8 || adminPassword.length > 16) {
        return res.status(400).json({ error: 'Password must be between 8 and 16 characters' });
      }

  
      try {
          console.log('Finding admin by email...');
          const admin = await findAdminEmail(adminEmail);
  
          if (!admin) {
              return res.status(400).json({ error: 'Invalid email or password' });
          }
  
          console.log('Comparing passwords...');
          const isMatch = await bcrypt.compare(adminPassword, admin.password);
  
          if (!isMatch) {
              console.log('Password does not match');
              return res.status(400).json({ error: 'Invalid email or password' });
          }
  
          console.log('Password matched. Generating JWT...');
          const token = jwt.sign(
              { id: admin.id, email: admin.adminEmail, role:admin.role },
              jwtSecret,
              { expiresIn: '24h' }
          );
  
          res.status(200).json({
              message: 'Login successful',
              admin: { id: admin.id, username: admin.adminName, email: admin.adminEmail, role:admin.role },
              token,
          });
      } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ error: 'Server error' });
      }
  };
  
