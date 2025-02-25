import { createComment, getCommentsByBlogId, getAllCommentsByAdmin, deleteCommentByAdmin } from '../models/CommentModel.js';
import { pool } from '../config/db.js';

jest.mock('../config/db.js'); // Mock the database pool


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


describe('Comment Model Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('createComment', () => {
        it('should create a new comment and return it', async () => {
            const blogId = 1;
            const userName = 'John Doe';
            const commentText = 'Great post!';
            const expectedComment = { id: 1, blog_id: blogId, user_name: userName, comment: commentText };

            pool.query.mockResolvedValueOnce({ rows: [expectedComment] }); // Mock the database response

            const result = await createComment(blogId, userName, commentText);
            expect(result).toEqual(expectedComment);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [blogId, userName, commentText]);
        });

        it('should throw an error if the database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(createComment(1, 'John Doe', 'Great post!')).rejects.toThrow('Database error');
        });
    });

    describe('getCommentsByBlogId', () => {
        it('should return comments for a given blog ID', async () => {
            const blogId = 1;
            const comments = [
                { id: 1, user_name: 'John Doe', comment: 'Great post!' },
                { id: 2, user_name: 'Jane Doe', comment: 'Thanks for sharing!' },
            ];

            pool.query.mockResolvedValueOnce({ rows: comments }); // Mock the database response

            const result = await getCommentsByBlogId(blogId);
            expect(result).toEqual(comments);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [blogId]);
        });

        it('should throw an error if the database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(getCommentsByBlogId(1)).rejects.toThrow('Database error');
        });
    });

    describe('getAllCommentsByAdmin', () => {
        it('should return all comments for admin', async () => {
            const comments = [
                { id: 1, user_name: 'John Doe', comment: 'Great post!', blog_title: 'Blog 1' },
                { id: 2, user_name: 'Jane Doe', comment: 'Thanks for sharing!', blog_title: 'Blog 2' },
            ];

            pool.query.mockResolvedValueOnce({ rows: comments }); // Mock the database response

            const result = await getAllCommentsByAdmin();
            expect(result).toEqual(comments);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String));
        });

        it('should throw an error if the database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(getAllCommentsByAdmin()).rejects.toThrow('Database error');
        });
    });

    describe('deleteCommentByAdmin', () => {
        it('should delete a comment and return the deleted comment', async () => {
            const commentId = 1;
            const deletedComment = { id: commentId };

            pool.query.mockResolvedValueOnce({ rows: [deletedComment] }); // Mock the database response

            const result = await deleteCommentByAdmin(commentId);
            expect(result).toEqual(deletedComment);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [commentId]);
        });
        
        it('should throw an error if the database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(deleteCommentByAdmin(1)).rejects.toThrow('Error deleting comment');
        });
    });
});