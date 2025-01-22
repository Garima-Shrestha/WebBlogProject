import {createUser, findEmail} from '../models/AuthModel.js';
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken';  // For generating JWT tokens
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret=process.env.JWT_SECRET;

export const register= async (req, res) => {
    const { userName, email, password} = req.body;

    try {
        console.log('Checking if user exists...');
        const existingUser = await findEmail(email);
    
        if (existingUser) {
          console.log('User exists: ', existingUser);
          return res.status(400).json({ error: 'Email already exists' });
        }
    
        console.log('Creating new user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(userName, email, hashedPassword);
    
        console.log('User created: ', newUser);
        
        if (!newUser) {
          console.log('Failed to create user');
          return res.status(500).json({ error: 'Failed to create user' });
        }
    
        console.log('Generating JWT...');
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email }, 
          jwtSecret, 
          { expiresIn: '24h' }
        );
    
        console.log('Sending response...');
        res.status(201).json({ message: 'User created successfully', token });
    
      } catch (error) {
        console.error('Signup error:', error); // Logs full error details
        res.status(500).json({ error: 'Server error', details: error.message });
      }
    };

    //login
    export const login = async (req, res) => {
      const { email, password } = req.body;
  
      try {
          console.log('Finding user by email...');
          const user = await findEmail(email);
  
          if (!user) {
              return res.status(400).json({ error: 'Invalid email or password' });
          }
  
          console.log('Comparing passwords...');
          const isMatch = await bcrypt.compare(password, user.password);
  
          if (!isMatch) {
              console.log('Password does not match');
              return res.status(400).json({ error: 'Invalid email or password' });
          }
  
          console.log('Password matched. Generating JWT...');
          const token = jwt.sign(
              { id: user.id, email: user.email },
              jwtSecret,
              { expiresIn: '24h' }
          );
  
          res.status(200).json({
              message: 'Login successful',
              user: { id: user.id, username: user.userName, email: user.email },
              token,
          });
      } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ error: 'Server error' });
      }
  };
  
