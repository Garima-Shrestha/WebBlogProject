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



// Mock the authentication middleware to simulate a non-admin user
jest.mock('../middleware/AuthMiddleware.js', () => (req, res, next) => {
    req.user = { id: 1, role: 'user' }; // Mock a regular user
    next();
});


// Mock the authentication middleware to simulate an admin user
jest.mock('../middleware/AuthMiddleware.js', () => (req, res, next) => {
    req.user = { id: 1, role: 'admin' }; // Mock an admin user
    next();
});



describe('Security Tests for Authentication Routes', () => {
    const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

    afterAll(async () => {
        await pool.end();  // Close the database connection after tests are finished
    });

    // Registration Tests
    describe('Registration', () => {
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
    });




    // Login Tests
    describe('Login', () => {
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
    });


    

    // Account Deletion Tests
    describe('Delete Account', () => {
        it('should prevent SQL Injection in delete account', async () => {
            const res = await request(app)
                .delete('/api/auth/deleteaccount') // Adjust to your actual route
                .set('Authorization', `Bearer ${mockToken}`) // Use a valid token
                .send({ userId: "1; DROP TABLE users; --" }); // SQL injection attempt
            
            expect(res.status).toBe(404);  // Ensure the request is rejected
            expect(res.body.error).toBe('User not found');
        });
        
        it('should prevent XSS attacks in delete account', async () => {
            const res = await request(app)
                .delete('/api/auth/deleteaccount') // Adjust to your actual route
                .set('Authorization', `Bearer ${mockToken}`) // Use a valid token
                .send({ userId: '<script>alert("XSS")</script>' }); // XSS attempt
            
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found');
        });
    });

    // 404 Error Handling Tests
    describe('404 Error Handling', () => {
        it('should return 404 for unknown routes', async () => {
            const res = await request(app).get('/api/auth/unknown-route');  // Unknown route
            expect(res.status).toBe(404);  // Ensure 404 status is returned
            expect(res.body.error).toBe('Route not found');  // Ensure the error message is correct
        });
    });




    describe('Admin Security Tests', () => {
        // Fetch Bloggers Tests
        describe('GET /api/auth/profileview', () => {
            it('should prevent SQL Injection in fetch bloggers', async () => {
                const res = await request(app)
                    .get('/api/auth/profileview?id=1 OR 1=1 --') // SQL injection attempt
                    .set('Authorization', `Bearer ${mockToken}`);
                
                expect(res.status).toBe(200);  // Ensure the request is processed
                expect(res.body.bloggers).toBeDefined(); // Ensure bloggers are returned
            });
    
            it('should return 404 for unknown routes', async () => {
                const res = await request(app)
                    .get('/api/auth/profileview/unknown-route') // Unknown route
                    .set('Authorization', `Bearer ${mockToken}`);
                
                expect(res.status).toBe(404);  // Ensure 404 status is returned
                expect(res.body.error).toBe('Route not found');  // Ensure the error message is correct
            });
        });
    
        // Add Blogger Tests
        describe('POST /api/auth/profileview/add', () => {
            it('should prevent SQL Injection in add blogger', async () => {
                const res = await request(app)
                    .post('/api/auth/profileview/add')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send({
                        username: "newBlogger'; DROP TABLE users; --",  // SQL injection attempt
                        email: 'newBlogger@example.com',
                        password: 'password123',
                    });
                
                expect(res.status).toBe(400);  // Ensure the request is rejected
                expect(res.body.error).toMatch('Invalid username format');  
            });
    
            it('should prevent XSS attacks in add blogger', async () => {
                const res = await request(app)
                    .post('/api/auth/profileview/add')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send({
                        username: '<script>alert("XSS")</script>',  // XSS attempt
                        email: 'newBlogger@example.com',
                        password: 'password123',
                    });
                
                expect(res.status).toBe(400);
                expect(res.body.error).toMatch('Invalid username format');  
            });
        });
    
        // Update Blogger Tests
        describe('PUT /api/auth/profileview/update/:id', () => {
            it('should prevent SQL Injection in update blogger', async () => {
                const res = await request(app)
                    .put('/api/auth/profileview/update/1')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send({
                        username: "updatedBlogger'; DROP TABLE users; --",  // SQL injection attempt
                        email: 'updatedBlogger@example.com',
                    });
                
                expect(res.status).toBe(400);  // Ensure the request is rejected
                expect(res.body.error).toMatch('Invalid username format');  
            });
    
            it('should prevent XSS attacks in update blogger', async () => {
                const res = await request(app)
                    .put('/api/auth/profileview/update/1')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send({
                        username: '<script>alert("XSS")</script>',  // XSS attempt
                        email: 'updatedBlogger@example.com',
                    });
                
                expect(res.status).toBe(400);
                expect(res.body.error).toMatch('Invalid username format');  
            });
        });
    
        // Delete Blogger Tests
        describe('DELETE /api/auth/profileview/delete/:id', () => {
            it('should prevent SQL Injection in delete blogger', async () => {
                const res = await request(app)
                    .delete('/api/auth/profileview/delete/1 OR 1=1 --')
                    .set('Authorization', `Bearer ${mockToken}`);
                
                expect(res.status).toBe(500);
                expect(res.body.message).toBe('Error deleting blogger');
            });
    
            it('should return 404 if blogger not found', async () => {
                const res = await request(app)
                    .delete('/api/auth/profileview/delete/999') // Non-existent ID
                    .set('Authorization', `Bearer ${mockToken}`);
                
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('Blogger not found');
            });
        });
    });
});