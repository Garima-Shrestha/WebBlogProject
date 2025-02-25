import request from 'supertest';
import app from '../index.js';  // Ensure you import your Express app
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

jest.mock('../config/db.js');  // Mock the database query function

const mockToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Security Tests', () => {
    // Test for SQL Injection
    describe('POST /api/createblog/makeblog/add - SQL Injection', () => {
        it('should safely handle SQL injection attempts via title', async () => {
            const maliciousTitle = "Test'; DROP TABLE blogs; --";
            
            // Mock successful insertion with sanitized input
            pool.query.mockResolvedValueOnce({ 
                rows: [{ 
                    id: 1, 
                    title: maliciousTitle, // Should contain the literal string
                    content: 'Valid content',
                    banner_image: 'test.jpg'
                }] 
            });
        
            const response = await request(app)
                .post('/api/createblog/makeblog/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', maliciousTitle)
                .field('content', 'Valid content')
                .field('email', 'test@example.com')
                .attach('imageFile', Buffer.from('dummy content'), { filename: 'test-image.jpg' });
        
            expect(response.status).toBe(201);
            expect(response.body.blog.title).toBe(maliciousTitle);
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
        it('should safely handle SQL injection in title', async () => {
          const maliciousTitle = "Test'; DROP TABLE blogs; --";
          
          // Mock EXACT response structure your model expects
          const mockResult = {
            rows: [{
              id: 1,
              user_id: 1, // Must match mockToken's user ID
              email: 'test@example.com',
              title: maliciousTitle,
              content: 'Valid content',
              banner_image: 'test.jpg',
              created_at: new Date(),
              updated_at: new Date()
            }]
          };
      
          // Mock the EXACT database response
          pool.query.mockResolvedValue(mockResult);
      
          const response = await request(app)
            .put('/api/createblog/makeblog/edit/1')
            .set('Authorization', `Bearer ${mockToken}`)
            .field('title', maliciousTitle)
            .field('content', 'Valid content')
            .field('email', 'test@example.com')
            .attach('imageFile', Buffer.from('dummy content'), 'test-image.jpg');
      
          expect(response.status).toBe(200);
          expect(response.body.blog.title).toBe(maliciousTitle);
        });
    });

    // Test for Updating Blog - XSS
    describe('PUT /api/createblog/makeblog/edit/:id - XSS Attack', () => {
        it('should accept content without sanitization', async () => {
          const xssContent = '<script>alert("XSS Attack")</script>';
          
          // Mock EXACT response structure your model expects
          const mockResult = {
            rows: [{
              id: 1,
              user_id: 1, // Must match mockToken's user ID
              email: 'test@example.com',
              title: 'Updated Title',
              content: xssContent,
              banner_image: 'test.jpg',
              created_at: new Date(),
              updated_at: new Date()
            }]
          };
      
          // Mock the EXACT database response
          pool.query.mockResolvedValue(mockResult);
      
          const response = await request(app)
            .put('/api/createblog/makeblog/edit/1')
            .set('Authorization', `Bearer ${mockToken}`)
            .field('title', 'Updated Title')
            .field('content', xssContent)
            .field('email', 'test@example.com')
            .attach('imageFile', Buffer.from('dummy content'), 'test-image.jpg');
      
          expect(response.status).toBe(200);
          expect(response.body.blog.content).toContain('<script>');
        });
    });

    // Test for Updating Blog - Blog Not Found
    describe('PUT /api/createblog/makeblog/edit/:id - Blog Not Found', () => {
        it('should return 404 if blog not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no blog found

            const response = await request(app)
                .put('/api/createblog/makeblog/edit/999') // Non-existing ID
                .set('Authorization', `Bearer ${mockToken}`)
                .field('title', 'Updated Blog Title')
                .field('content', 'This is a test content.')
                .field('email', 'test@example.com')
                .attach('imageFile', Buffer.from('dummy content'), { filename: 'test-image.jpg' }); // Mock file upload

            expect(response.status).toBe(404); // Expect a 404 error
            expect(response.body.message).toBe('Blog not found'); // Ensure the correct error message is returned
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