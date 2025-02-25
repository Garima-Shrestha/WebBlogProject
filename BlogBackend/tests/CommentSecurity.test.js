import request from 'supertest';
import app from '../index.js';  // Ensure you import your Express app
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

jest.mock('../config/db.js');  // Mock the database query function

const mockToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

let originalConsoleError;

beforeAll(() => {
    originalConsoleError = console.error; // Store the original console.error
    console.error = jest.fn(); // Mock console.error
});

afterAll(() => {
    console.error = originalConsoleError; // Restore original console.error
});

describe('Comment Security Tests', () => {
    // SQL Injection Tests
    describe('POST /api/bloggercomment/comments - SQL Injection', () => {
        it('should allow SQL injection in comments', async () => {
            const maliciousCommentData = {
                blogId: 1,
                userName: 'John Doe',
                comment: "'; DROP TABLE comments; --", // SQL Injection attempt
            };

            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...maliciousCommentData }] }); // Mock the database response

            const response = await request(app)
                .post('/api/bloggercomment/comments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(maliciousCommentData);

            expect(response.status).toBe(201); // Expect a successful response
            expect(response.body.comment).toBe(maliciousCommentData.comment); // Ensure the comment is saved
        });
    });

    // XSS Attack Tests
    describe('POST /api/bloggercomment/comments - XSS Attack', () => {
        it('should allow XSS in comments', async () => {
            const xssCommentData = {
                blogId: 1,
                userName: 'John Doe',
                comment: '<script>alert("XSS Attack")</script>', // XSS attempt
            };

            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...xssCommentData }] }); // Mock the database response

            const response = await request(app)
                .post('/api/bloggercomment/comments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(xssCommentData);

            expect(response.status).toBe(201); // Expect a successful response
            expect(response.body.comment).toBe(xssCommentData.comment); // Ensure the comment is saved
        });
    });

    // General Error Handling Tests
    describe('POST /api/bloggercomment/comments - Database Error', () => {
        it('should return 500 on database error', async () => {
            const validCommentData = {
                blogId: 1,
                userName: 'John Doe',
                comment: 'This is a valid comment.',
            };

            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

            const response = await request(app)
                .post('/api/bloggercomment/comments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(validCommentData);

            expect(response.status).toBe(500); // Expect a 500 response
            expect(response.body.error).toBe('An error occurred while posting the comment.'); // Ensure the error message is correct
        });
    });
    
    // 404 Error Handling Tests
    describe('GET /api/bloggercomment/comments/:blogId - 404 Error', () => {
        it('should return 404 for non-existent blog ID', async () => {
            const nonExistentBlogId = 999; // Assuming this ID does not exist

            pool.query.mockResolvedValueOnce({ rows: [] }); // Mock the database response to return no comments

            const response = await request(app)
                .get(`/api/bloggercomment/comments/${nonExistentBlogId}`)
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404); // Expect a 404 response
            expect(response.body.error).toBe('Blog not found.'); // Ensure the error message is correct
        });
    });

    describe('DELETE /api/bloggercomment/admin/delete/:id - 404 Error', () => {
        it('should return 404 for non-existent comment ID', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no comment found
    
            const response = await request(app)
                .delete('/api/bloggercomment/admin/delete/9999') // Assuming 9999 does not exist
                .set('Authorization', `Bearer ${mockToken}`);
    
            expect(response.status).toBe(404); // Expecting a not found response
            expect(response.body.error).toBe('Comment not found.'); // Check for specific error message
        });
    });
});