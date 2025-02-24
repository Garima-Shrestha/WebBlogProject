import request from 'supertest';
import app from '../index.js'; 
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

jest.mock('../config/db.js');  
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));


describe('Auth Route Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();  // Clear mock data after each test
    });


    // Registration Tests
    describe('POST /api/auth/register', () => {
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
            const mockUser  = { id: 1, username: 'testUser ', email: 'test@example.com' }
            pool.query.mockResolvedValueOnce({ rows: [mockUser ] }); // Simulate existing user

            const response = await request(app)
                .post('/api/auth/register')  
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

        it('should fail to sign up with short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ userName: 'testUser ', email: 'test@example.com', password: 'short' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Password must be between 8 and 16 characters');
        });

        it('should fail to sign up with long password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ userName: 'testUser ', email: 'test@example.com', password: 'thisPasswordIsWayTooLong' });
        
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Password must be between 8 and 16 characters');
        });
    });



    // Login Tests
    describe('POST /api/auth/login', () => {
        it('should login a user successfully', async () => {
            const mockUser   = {
                id: 1,
                username: 'testUser ',
                email: 'test@example.com',
                password: 'hashedPassword', 
            };

            pool.query.mockResolvedValueOnce({ rows: [mockUser ] }); 

            const response = await request(app)
                .post('/api/auth/login')  
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBeDefined();  
        });

        it('should fail to login with invalid email', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); 

            const response = await request(app)
                .post('/api/auth/login')  
                .send({ email: 'nonexistent@example.com', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid email or password');
        });

        it('should fail to login with incorrect password', async () => {
            const mockUser   = {
                id: 1,
                username: 'testUser ',
                email: 'test@example.com',
                password: 'hashedPassword', 
            };

            pool.query.mockResolvedValueOnce({ rows: [mockUser ] }); 
            bcrypt.compare.mockResolvedValueOnce(false); // Simulate password mismatch

            const response = await request(app)
                .post('/api/auth/login')  
                .send({ email: 'test@example.com', password: 'wrongPassword' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid email or password');
        });
    });
});