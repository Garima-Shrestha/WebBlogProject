import request from 'supertest';
import app from '../index.js';  // Ensure you import your Express app
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


jest.mock('../config/db.js');  // Mock the database query function
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));


jest.mock('../middleware/AuthMiddleware.js', () => (req, res, next) => {
  req.user = { id: 1 }; 
  next();
});

const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });



let originalConsoleError;
beforeAll(() => {
    originalConsoleError = console.error; // Store the original console.error
    console.error = jest.fn(); // Mock console.error
});
afterAll(() => {
    console.error = originalConsoleError; // Restore original console.error
});
afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
});


describe('Auth Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();  // Clear mock data after each test
    });


    // Registration
    it('should sign up a new user', async () => {
        // Mock database to simulate no existing user
        pool.query.mockResolvedValueOnce({ rows: [] }); // No existing users
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, username: 'testUser ', email: 'test@example.com' }] }); // Simulate user creation

        const response = await request(app)
        .post('/api/auth/register')  
        .send({ userName: 'testUser ', email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.token).toBeDefined(); // Ensure token is returned
    });


    it('should fail to sign up if email already exists', async () => {
        const mockUser = { id: 1, username: 'testUser ', email: 'test@example.com' }
        pool.query.mockResolvedValueOnce({ rows: [mockUser] }); // Simulate existing user

        const response = await request(app)
        .post('/api/auth/register')  // Change to your actual route
        .send({ userName: 'testUser ', email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email already exists');
    });


    it('should fail to sign up with invalid username format', async () => {
      const response = await request(app)
          .post('/api/auth/register')
          .send({ userName: 'invalid username!', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid username format. Only alphanumeric characters, underscores, and spaces are allowed.'); 
    });


    it('should fail to sign up with invalid email format', async () => {
      const response = await request(app)
          .post('/api/auth/register')
          .send({ userName: 'testUser ', email: 'invalidEmail', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email format');
    });


    it('should hash the password when registering a new user', async () => {
      // Mock database to simulate no existing user
      pool.query.mockResolvedValueOnce({ rows: [] }); // No existing users
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, username: 'testUser  ', email: 'test@example.com' }] }); // Simulate user creation
  
      const response = await request(app)
          .post('/api/auth/register')
          .send({ userName: 'testUser  ', email: 'test@example.com', password: 'password123' });
  
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.token).toBeDefined(); // Ensure token is returned
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', expect.any(Number)); // Check if bcrypt.hash was called
    });  

    
    it('should fail to sign up with short password', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ userName: 'testUser ', email: 'test@example.com', password: 'short' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Password must be between 8 and 16 characters');
        expect(bcrypt.hash).not.toHaveBeenCalled(); // Ensure bcrypt.hash was not called
    });


    it('should fail to sign up with long password', async () => {
      const response = await request(app)
          .post('/api/auth/register')
          .send({ userName: 'testUser  ', email: 'test@example.com', password: 'thisPasswordIsWayTooLong' });
  
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password must be between 8 and 16 characters');
      expect(bcrypt.hash).not.toHaveBeenCalled(); // Ensure bcrypt.hash was not called
    });




    // Login
    it('should login a user successfully', async () => {
        const mockUser  = {
          id: 1,
          username: 'testUser ',
          email: 'test@example.com',
          password: 'hashedPassword', 
        };
    
        pool.query.mockResolvedValueOnce({ rows: [mockUser ] }); // Simulate user found in DB
    
        const response = await request(app)
          .post('/api/auth/login')  
          .send({ email: 'test@example.com', password: 'password123' });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.token).toBeDefined();  
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser .password); // Check if bcrypt.compare was called
      });




      // Delete Account Test
      it('should delete the user account successfully', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }); // Simulate successful deletion

        const response = await request(app)
            .delete('/api/auth/deleteaccount') // Adjust to your actual route
            .set('Authorization', `Bearer ${mockToken}`); // Use the mockToken

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Account deleted successfully');
      });


      it('should return 404 if user not found', async () => {
        // Mock the deleteAccount function to simulate user not found
        pool.query.mockResolvedValueOnce({ rowCount: 0 }); // Simulate that no user was found

        const response = await request(app)
            .delete('/api/auth/deleteaccount') // Adjust to your actual route
            .set('Authorization', `Bearer ${mockToken}`); // Use the mockToken

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
      });


      it('should return 500 if there is a server error', async () => {
        // Mock the deleteAccount function to simulate a server error
        pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

        const response = await request(app)
            .delete('/api/auth/deleteaccount') // Adjust to your actual route
            .set('Authorization', `Bearer ${mockToken}`); // Use the mockToken

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Server error');
      });
});