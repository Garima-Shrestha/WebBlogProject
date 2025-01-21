import {createUser, findUser} from '../models/Register.js';
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken';  // For generating JWT tokens

export const register= async (req, res) => {
    const { userName, email, password, passwordConfirmation } = req.body;

    // Validate user inputs
    if (!userName || !email || !password || !passwordConfirmation) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== passwordConfirmation) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check password strength
    if (password.length < 8 || password.length > 16) {
        return res.status(400).json({ message: 'Password must be between 8 and 16 characters' });
    }

    // Check if the email already exists in the database
    try {
        const existingEmail = await findUser(email);
        console.log('Existing Email Result:', existingEmail);
        if (existingEmail && existingEmail.rows && existingEmail.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await createUser({ userName, email, password: hashedPassword });

        // Generate JWT token (optional)
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser.id, userName: newUser.username, email: newUser.email },
            token
        });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

