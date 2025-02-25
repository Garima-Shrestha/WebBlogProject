import request from 'supertest';
import app from '../index.js';  // Ensure you import your Express app
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

jest.mock('../config/db.js');  // Mock the database query function

const mockToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Security Tests', () => {
    // Test for SQL Injection
    describe('POST /api/createblog/makeblog/add - SQL Injection', () => {
        it('should not allow SQL injection in title', async () => {
            const maliciousTitle = "Test'; DROP TABLE blogs; --";
            pool.query.mockImplementationOnce(() => {
                return Promise.resolve({ rows: [] }); // Simulate a response that would occur if SQL injection was attempted
            });

            const response = await request(app)
                .post('/api/createblog/makeblog/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', maliciousTitle)
                .field('content', 'This is a test content.')
                .field('email', 'test@example.com')
                .attach('imageFile', Buffer.from('dummy content'), { filename: 'test-image.jpg' }); // Mock file upload

            expect(response.status).toBe(400); // Expect a validation error
            expect(response.body.error).toBeDefined(); // Ensure an error message is returned
        });
    });

    // Test for XSS
    describe('POST /api/createblog/makeblog/add - XSS Attack', () => {
        it('should sanitize input to prevent XSS', async () => {
            const xssContent = '<script>alert("XSS Attack")</script>';
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test Blog Title', content: 'This is a test content.', email: 'test@example.com', banner_image: 'test-image.jpg' }] }); // Mock successful creation

            const response = await request(app)
                .post('/api/createblog/makeblog/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', 'Test Blog Title')
                .field('content', xssContent)
                .field('email', 'test@example.com')
                .attach('imageFile', Buffer.from('dummy content'), { filename: 'test-image.jpg' }); // Mock file upload

            expect(response.status).toBe(201); // Expect the blog to be created successfully
            expect(response.body.blog.content).not.toContain('<script>'); // Ensure the XSS script is not present in the content
        });
    });

    // Test for 404 Error Handling
    describe('GET /api/createblog/makeblog/fetch/:id - 404 Error', () => {
        it('should return 404 if blog not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no blog found

            const response = await request(app)
                .get('/api/createblog/makeblog/fetch/999') // Non-existing ID
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Blog not found');
        });
    });

    // Test for Updating Blog - SQL Injection
    describe('PUT /api/createblog/makeblog/edit/:id - SQL Injection', () => {
        it('should not allow SQL injection in title', async () => {
            const maliciousTitle = "Test'; DROP TABLE blogs; --";
            pool.query.mockImplementationOnce(() => {
                return Promise.resolve({ rows: [] }); // Simulate a response that would occur if SQL injection was attempted
            });

            const response = await request(app)
                .put('/api/createblog/makeblog/edit/1') // Assuming ID 1 exists
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', maliciousTitle)
                .field('content', 'This is a test content.')
                .field('email', 'test@example.com')
                .attach('imageFile', Buffer.from('dummy content'), { filename: 'test-image.jpg' }); // Mock file upload

            expect(response.status).toBe(400); // Expect a validation error
            expect(response.body.error).toBeDefined(); // Ensure an error message is returned
        });
    });

    // Test for Updating Blog - XSS
    describe('PUT /api/createblog/makeblog/edit/:id - XSS Attack', () => {
        it('should sanitize input to prevent XSS', async () => {
            const xssContent = '<script>alert("XSS Attack")</script>';
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Updated Blog Title', content: 'This is a test content.', email: 'test@example.com', banner_image: 'test-image.jpg' }] }); // Mock successful update

            const response = await request(app)
                .put('/api/createblog/makeblog/edit/1') // Assuming ID 1 exists
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', 'Updated Blog Title')
                .field('content', xssContent)
                .field('email', 'test@example.com')
                .attach('imageFile', Buffer.from('dummy content'), { filename: 'test-image.jpg' }); // Mock file upload

            expect(response.status).toBe(200); // Expect the blog to be updated successfully
            expect(response.body.blog.content).not.toContain('<script>'); // Ensure the XSS script is not present in the content
        });
    });

    // Test for Deleting Blog - 404 Error
    describe('DELETE /api/createblog/makeblog/delete/:id - 404 Error', () => {
        it('should return 404 if blog not found for deletion', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no blog found

            const response = await request(app)
                .delete('/api/createblog/makeblog/delete/999') // Non-existing ID
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Blog not found');
        });
    });
});