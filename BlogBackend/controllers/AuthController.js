import {createUser, findEmail, deleteAccount} from '../models/AuthModel.js';
import { getBloggerInfo, deleteBloggerById, updateBloggerById, addBloggersByAdmin } from '../models/AuthModel.js'
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken';  // For generating JWT tokens
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret=process.env.JWT_SECRET;

export const register= async (req, res) => {
    const { userName, email, password, role='blogger'} = req.body;


    //validation
    const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailCheck.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!password || password.length < 8 || password.length > 16) {
        return res.status(400).json({ error: 'Password must be between 8 and 16 characters' });
    }

      

    try {
        console.log('Checking if user exists...');
        const existingUser = await findEmail(email);
    
        if (existingUser) {
          console.log('User exists: ', existingUser);
          return res.status(400).json({ error: 'Email already exists' });
        }
    
        console.log('Creating new user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(userName, email, hashedPassword, role);
    
        console.log('User created: ', newUser);
        
        if (!newUser) {
          console.log('Failed to create user');
          return res.status(500).json({ error: 'Failed to create user' });
        }
    
        console.log('Generating JWT...');
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email, role:newUser.role  }, 
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
              { id: user.id, email: user.email, role:user.role  },
              jwtSecret,
              { expiresIn: '24h' }
          );
  
          res.status(200).json({
              message: 'Login successful',
              user: { id: user.id, username: user.userName, email: user.email, role:user.role  },
              token,
          });
      } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ error: 'Server error' });
      }
  };



  //For Managing Account i.e. deleting account
export const deleteingAccount = async (req, res) => {
  const userId = req.user.id;  // Extract user ID from token

  try {
    console.log("Deleting user account...");
    const deletedUser = await deleteAccount(userId);

    if (!deletedUser) {
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error managing account:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

  




// Admin le bloggers haru add, delete, update ra fetch garna milne
//Fetch
export const fetchBloggerInfo = async (req, res) => {
    try {
        const bloggers = await getBloggerInfo();
        if (!bloggers) {
            return res.status(404).json({ message: 'Bloggers Profile not found' });
        }

        res.json({message: 'Bloggers Profile fetched', bloggers}); 
    } catch (error) {
        console.error('Error in fetchBloggerInfo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Delete
export const deleteBlogger = async (req, res) => {
    const bloggerId = req.params.id; // Get the ID from the request parameters
    try {
        const result = await deleteBloggerById(bloggerId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Blogger not found' });
        }
        res.status(200).json({ message: 'Blogger deleted successfully' });
    } catch (error) {
        console.error('Error deleting blogger:', error);
        res.status(500).json({ message: 'Error deleting blogger', error: error.message });
    }
};


// Update
export const updateBlogger = async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

  try {
    // If the request includes a password, hash it before updating
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await updateBloggerById(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};


// Add
export const addBlogger = async (req, res) => {
    const { username, email, password } = req.body; // Get data from request body

    try {
         const hashedPassword = await bcrypt.hash(password, 10);
         console.log('Hashed password:', hashedPassword); // Debugging
        const newBlogger = await addBloggersByAdmin(username, email, hashedPassword); // Call the model function to add the blogger
        res.status(201).json({ message: 'Blogger added successfully', blogger: newBlogger });
    } catch (error) {
        console.error('Error adding blogger:', error);
        res.status(500).json({ message: 'Error adding blogger', error: error.message });
    }
};