import request from 'supertest';
import app from '../index.js';  // Ensure you import your Express app
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

jest.mock('../config/db.js');  // Mock the database query function

const mockToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
const tempFilePath = path.join(__dirname, 'temp-test-image.jpg');

// Create a temporary file for testing
beforeAll(() => {
    fs.writeFileSync(tempFilePath, 'test image content');
});

// Clean up the temporary file after tests
afterAll(() => {
    fs.unlinkSync(tempFilePath);
});


let originalConsoleError;

beforeAll(() => {
    originalConsoleError = console.error; // Store the original console.error
    console.error = jest.fn(); // Mock console.error
});

afterAll(() => {
    console.error = originalConsoleError; // Restore original console.error
});

afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
});


describe('MakeABlog Routes Tests', () => {
    // Test for creating a new blog
    describe('POST /api/createblog/makeblog/add', () => {
        it('should create a new blog successfully', async () => {
            const newBlogData = {
                title: 'Test Blog Title',
                content: 'This is the content of the test blog.',
                email: 'test@example.com',
            };

            const mockBlog = {
                id: 1,
                user_id: 1,
                ...newBlogData,
                banner_image: 'test-image.jpg',
            };

            pool.query.mockResolvedValueOnce({ rows: [mockBlog] }); // Mock the database response

            const response = await request(app)
                .post('/api/createblog/makeblog/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', newBlogData.title)
                .field('content', newBlogData.content)
                .field('email', newBlogData.email)
                .attach('imageFile', tempFilePath); // Use the temporary file

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Blog created successfully');
            expect(response.body.blog).toEqual(expect.objectContaining(mockBlog));
        });

        it('should return 400 if validation fails', async () => {
            const invalidBlogData = {
                title: '',
                content: 'This is the content of the test blog.',
                email: 'test@example.com',
            };

            const response = await request(app)
                .post('/api/createblog/makeblog/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', invalidBlogData.title)
                .field('content', invalidBlogData.content)
                .field('email', invalidBlogData.email);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Title, content, banner image, and email are required');
        });
    });

    // Test for fetching a blog by ID
    describe('GET /api/createblog/makeblog/fetch/:id', () => {
        it('should fetch a blog by ID successfully', async () => {
            const mockBlog = {
                id: 1,
                user_id: 1,
                title: 'Test Blog Title',
                content: 'This is the content of the test blog.',
                banner_image: 'test-image.jpg',
                email: 'test@example.com',
            };

            pool.query.mockResolvedValueOnce({ rows: [mockBlog] }); // Mock the database response

            const response = await request(app)
                .get('/api/createblog/makeblog/fetch/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Blog found successfully');
            expect(response.body.fetchBlog).toEqual(expect.objectContaining(mockBlog));
        });

        it('should return 404 if blog not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no blog found

            const response = await request(app)
                .get('/api/createblog/makeblog/fetch/999') // Non-existing ID
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Blog not found');
        });
    });

    // Test for updating an existing blog
    describe('PUT /api/createblog/makeblog/edit/:id', () => {
        it('should update an existing blog successfully', async () => {
            const updatedBlogData = {
                title: 'Updated Blog Title',
                content: 'This is the updated content of the test blog.',
                email: 'test@example.com',
            };

            const mockUpdatedBlog = {
                id: 1,
                user_id: 1,
                ...updatedBlogData,
                banner_image: 'updated-image.jpg',
            };

            // Mock the database response to return the updated blog
            pool.query.mockResolvedValue({ rows: [mockUpdatedBlog] }); // Ensure this line returns the correct structure

            const response = await request(app)
                .put('/api/createblog/makeblog/edit/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', updatedBlogData.title)
                .field('content', updatedBlogData.content)
                .field('email', updatedBlogData.email)
                .attach('imageFile', tempFilePath); // Use the temporary file

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Blog updated successfully');
            expect(response.body.blog).toEqual(expect.objectContaining(mockUpdatedBlog));
        });
    });


    // Test for deleting a blog
    describe('DELETE /api/createblog/makeblog/delete/:id', () => {
        it('should delete a blog successfully', async () => {
            // Mock the database response to simulate successful deletion
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Ensure this line returns the correct structure

            const response = await request(app)
                .delete('/api/createblog/makeblog/delete/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Blog deleted successfully');
        });

        it('should return 404 if blog not found for deletion', async () => {
            // Mock the database response to simulate no blog found
            pool.query.mockResolvedValueOnce({ rows: [] }); // Ensure this line simulates no blog found

            const response = await request(app)
                .delete('/api/createblog/makeblog/delete/999') // Non-existing ID
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Blog not found');
        });
    });


    // Test for fetching all blogs(homepage)
    describe('GET /api/createblog/makeblog/all', () => {
        it('should fetch all blogs successfully', async () => {
            const mockBlogs = [
                {
                    id: 1,
                    user_id: 1,
                    title: 'Test Blog Title',
                    content: 'This is the content of the test blog.',
                    banner_image: 'test-image.jpg',
                    email: 'test@example.com',
                },
                {
                    id: 2,
                    user_id: 2,
                    title: 'Another Blog Title',
                    content: 'Content of another blog.',
                    banner_image: 'another-image.jpg',
                    email: 'author2@example.com',
                },
            ];

            pool.query.mockResolvedValueOnce({ rows: mockBlogs }); // Mock the database response

            const response = await request(app)
                .get('/api/createblog/makeblog/all')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Fetching all blogs');
            expect(response.body.blogs).toEqual(mockBlogs);
        });

        it('should return 500 if there is an error fetching blogs', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

            const response = await request(app)
                .get('/api/createblog/makeblog/all')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error fetching blogs');
        });
    });

    

    // Test for admin deleting a blog
    describe('DELETE /api/createblog/makeblog/admin/delete/:id', () => {
        it('should delete a blog by admin successfully', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Mock the database response

            const response = await request(app)
                .delete('/api/createblog/makeblog/admin/delete/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Blog deleted successfully');
        });

        it('should return 404 if blog not found for deletion', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no blog found
    
            const response = await request(app)
                .delete('/api/createblog/makeblog/admin/delete/999') // Non-existing ID
                .set('Authorization', `Bearer ${mockToken}`);
    
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Blog not found'); // Ensure this matches the controller response
        });
    
        it('should return 500 if there is an error deleting the blog', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error
    
            const response = await request(app)
                .delete('/api/createblog/makeblog/admin/delete/1')
                .set('Authorization', `Bearer ${mockToken}`);
    
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error'); // Ensure this matches the controller response
        });
    });



    // Test for fetching user blogs
    describe('GET /api/createblog/yourblog', () => {
        it('should fetch user blogs successfully', async () => {
            const mockUserBlogs = [
                {
                    id: 1,
                    user_id: 1,
                    title: 'User  Blog Title',
                    content: 'Content of user blog.',
                    banner_image: 'user-image.jpg',
                    email: 'test@example.com',
                },
                {
                    id: 2,
                    user_id: 1,
                    title: 'Another User Blog Title',
                    content: 'Content of another user blog.',
                    banner_image: 'another-user-image.jpg',
                    email: 'test@example.com',
                },
            ];

            pool.query.mockResolvedValueOnce({ rows: mockUserBlogs }); // Mock the database response

            const response = await request(app)
                .get('/api/createblog/yourblog')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Fetching user blogs');
            expect(response.body.blogs).toEqual(mockUserBlogs);
        });

        it('should return 500 if there is an error fetching user blogs', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

            const response = await request(app)
                .get('/api/createblog/yourblog')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error fetching user blogs');
        });
    });
});