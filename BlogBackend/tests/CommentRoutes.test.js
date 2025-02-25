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



describe('Comment Routes Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    // Test for posting a comment
    describe('POST /api/bloggercomment/comments', () => {
        it('should post a comment successfully', async () => {
            const newCommentData = {
                blogId: 1,
                userName: 'John Doe',
                comment: 'Great post!',
            };

            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...newCommentData }] }); // Mock the database response

            const response = await request(app)
                .post('/api/bloggercomment/comments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(newCommentData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newCommentData));
        });

        it('should return 400 if userName or comment is missing', async () => {
            const invalidCommentData = {
                blogId: 1,
                userName: '',
                comment: 'Great post!',
            };

            const response = await request(app)
                .post('/api/bloggercomment/comments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(invalidCommentData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('User name and comment are required.');
        });
    });

    // Test for getting comments by blog ID
    describe('GET /api/bloggercomment/comments/:blogId', () => {
        it('should fetch comments for a blog', async () => {
            const comments = [
                { id: 1, user_name: 'John Doe', comment: 'Great post!' },
                { id: 2, user_name: 'Jane Doe', comment: 'Thanks for sharing!' },
            ];

            pool.query.mockResolvedValueOnce({ rows: comments }); // Mock the database response

            const response = await request(app)
                .get('/api/bloggercomment/comments/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(comments);
        });

        it('should return 500 on error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .get('/api/bloggercomment/comments/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('An error occurred while fetching comments.');
        });
    });

    // Test for getting all comments (admin)
    describe('GET /api/bloggercomment/admin/comments', () => {
        it('should fetch all comments for admin', async () => {
            const comments = [
                { id: 1, user_name: 'John Doe', comment: 'Great post!', blog_title: 'Blog 1' },
                { id: 2, user_name: 'Jane Doe', comment: 'Thanks for sharing!', blog_title: 'Blog 2' },
            ];

            pool.query.mockResolvedValueOnce({ rows: comments }); // Mock the database response

            const response = await request(app)
                .get('/api/bloggercomment/admin/comments')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(comments);
        });

        it('should return 500 on error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .get('/api/bloggercomment/admin/comments')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('An error occurred while fetching comments.');
        });
    });

    // Test for deleting a comment (admin)
    describe('DELETE /api/bloggercomment/admin/delete/:id', () => {
        it('should delete a comment successfully', async () => {
            pool.query.mockResolvedValueOnce({ rows: [1] }); // Simulate successful deletion

            const response = await request(app)
                .delete('/api/bloggercomment/admin/delete/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Comment deleted successfully.');
        });

        it('should return 404 if comment not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate comment not found

            const response = await request(app)
                .delete('/api/bloggercomment/admin/delete/999')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Comment not found.');
        });

        it('should return 500 on error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .delete('/api/bloggercomment/admin/delete/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('An error occurred while deleting the comment.');
        });
    });
});