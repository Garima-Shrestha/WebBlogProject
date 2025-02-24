import request from 'supertest';
import app from '../index.js';  // Adjust to your server path
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';


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


describe('Security Tests for Authentication Routes', () => {
    const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

    afterAll(async () => {
        await pool.end();  // Close the database connection after tests are finished
    });

    // Test for SQL Injection prevention during user registration
    it('should prevent SQL Injection in register', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                userName: "testuser' OR 1=1 --",  // SQL injection attempt
                email: 'test1@example.com',
                password: 'password123',
            });
        
        expect(res.status).toBe(400);  // Ensure the request is rejected
        expect(res.body.error).toMatch('Invalid username format');  
    });

    // Test for SQL Injection during user login
    it('should prevent SQL Injection in login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: "test1@example.com",
                password: 'password123 OR 1=1 --',  // SQL injection attempt
            });
        
        expect(res.status).toBe(400);  // Ensure the request is rejected
        expect(res.body.error).toBe('Invalid email or password');
    });

    
    // Test for XSS attack prevention in registration
    it('should prevent XSS attacks in register', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                userName: '<script>alert("XSS")</script>',  // XSS attempt
                email: 'test_xss@example.com',
                password: 'password123',
            });
        
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch('Invalid username format');  
    });

    // Test for XSS attack prevention in login
    it('should prevent XSS attacks in login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: '<script>alert("XSS")</script>',  // XSS attempt
                password: 'password123',
            });
        
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });


    // Test for 404 error handling for unknown routes
    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/api/auth/unknown-route');  // Unknown route
        expect(res.status).toBe(404);  // Ensure 404 status is returned
        expect(res.body.error).toBe('Route not found');  // Ensure the error message is correct
    });




    // Test for SQL Injection prevention during account deletion
    it('should prevent SQL Injection in delete account', async () => {
        const res = await request(app)
            .delete('/api/auth/deleteaccount') // Adjust to your actual route
            .set('Authorization', `Bearer ${mockToken}`) // Use a valid token
            .send({ userId: "1; DROP TABLE users; --" }); // SQL injection attempt
        
        expect(res.status).toBe(404);  // Ensure the request is rejected
        expect(res.body.error).toBe('User not found');
    });
    
    // Test for XSS attack prevention in delete account
    it('should prevent XSS attacks in delete account', async () => {
        const res = await request(app)
            .delete('/api/auth/deleteaccount') // Adjust to your actual route
            .set('Authorization', `Bearer ${mockToken}`) // Use a valid token
            .send({ userId: '<script>alert("XSS")</script>' }); // XSS attempt
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found');
    });

    // Test for 404 error handling for unknown routes
    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/api/auth/unknown-route');  // Unknown route
        expect(res.status).toBe(404);  // Ensure 404 status is returned
        expect(res.body.error).toBe('Route not found');  // Ensure the error message is correct
    });
});