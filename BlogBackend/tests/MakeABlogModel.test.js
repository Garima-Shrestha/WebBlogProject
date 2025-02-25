import { createBlog, getBlogById, updateBlog, deleteBlog, getAllBlogsWithAuthors, deleteBlogByAdmin, getBlogsByUserId } from '../models/MakeABlogModel.js';
import { pool } from '../config/db.js';

jest.mock('../config/db.js'); // Mock the database pool

describe('MakeABlogModel Tests', () => {
    const mockUserId = 1;
    const mockEmail = 'test@example.com';
    const mockTitle = 'Test Blog Title';
    const mockContent = 'This is the content of the test blog.';
    const mockBannerImage = 'test-image.jpg';
    const mockBlogId = 1;


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

    describe('createBlog', () => {
        it('should create a new blog successfully', async () => {
            const mockBlog = {
                id: mockBlogId,
                user_id: mockUserId,
                email: mockEmail,
                title: mockTitle,
                content: mockContent,
                banner_image: mockBannerImage,
            };

            pool.query.mockResolvedValueOnce({ rows: [mockBlog] }); // Mock the database response

            const result = await createBlog(mockUserId, mockEmail, mockTitle, mockContent, mockBannerImage);
            expect(result).toEqual(mockBlog);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockUserId, mockEmail, mockTitle, mockContent, mockBannerImage]);
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(createBlog(mockUserId, mockEmail, mockTitle, mockContent, mockBannerImage)).rejects.toThrow('Error creating blog');
        });
    });

    describe('getBlogById', () => {
        it('should fetch a blog by ID successfully', async () => {
            const mockBlog = {
                id: mockBlogId,
                user_id: mockUserId,
                email: mockEmail,
                title: mockTitle,
                content: mockContent,
                banner_image: mockBannerImage,
            };

            pool.query.mockResolvedValueOnce({ rows: [mockBlog] }); // Mock the database response

            const result = await getBlogById(mockBlogId);
            expect(result).toEqual(mockBlog);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockBlogId]);
        });

        it('should return undefined if blog not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no blog found

            const result = await getBlogById(mockBlogId);
            expect(result).toBeUndefined();
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(getBlogById(mockBlogId)).rejects.toThrow('Error retrieving blog');
        });
    });

    describe('updateBlog', () => {
        it('should update an existing blog successfully', async () => {
            const updatedBlog = {
                id: mockBlogId,
                user_id: mockUserId,
                email: mockEmail,
                title: 'Updated Blog Title',
                content: 'This is the updated content of the test blog.',
                banner_image: 'updated-image.jpg',
            };

            pool.query.mockResolvedValueOnce({ rows: [updatedBlog] }); // Mock the database response

            const result = await updateBlog(mockBlogId, updatedBlog.title, updatedBlog.content, updatedBlog.banner_image, mockUserId, mockEmail);
            expect(result).toEqual(updatedBlog);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockBlogId, updatedBlog.title, updatedBlog.content, updatedBlog.banner_image, mockUserId, mockEmail]);
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(updateBlog(mockBlogId, mockTitle, mockContent, mockBannerImage, mockUserId, mockEmail)).rejects.toThrow('Error updating blog');
        });
    });

    describe('deleteBlog', () => {
        it('should delete a blog successfully', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: mockBlogId }] }); // Mock the database response

            const result = await deleteBlog(mockBlogId, mockUserId);
            expect(result).toEqual({ id: mockBlogId });
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockBlogId, mockUserId]);
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(deleteBlog(mockBlogId, mockUserId)).rejects.toThrow('Error deleting blog');
        });
    });



    // HomePage
    describe('getAllBlogsWithAuthors', () => {
        it('should fetch all blogs with authors successfully', async () => {
            const mockBlogs = [
                {
                    id: mockBlogId,
                    user_id: mockUserId,
                    email: mockEmail,
                    title: mockTitle,
                    content: mockContent,
                    banner_image: mockBannerImage,
                },
                {
                    id: 2,
                    user_id: 2,
                    email: 'author2@example.com',
                    title: 'Another Blog Title',
                    content: 'Content of another blog.',
                    banner_image: 'another-image.jpg',
                },
            ];

            pool.query.mockResolvedValueOnce({ rows: mockBlogs }); // Mock the database response

            const result = await getAllBlogsWithAuthors();
            expect(result).toEqual(mockBlogs);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String));
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(getAllBlogsWithAuthors()).rejects.toThrow('Error fetching blogs');
        });
    });



    // Admin
    describe('deleteBlogByAdmin', () => {
        it('should delete a blog by admin successfully', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: mockBlogId }] }); // Mock the database response

            const result = await deleteBlogByAdmin(mockBlogId);
            expect(result).toEqual({ id: mockBlogId });
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockBlogId]);
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(deleteBlogByAdmin(mockBlogId)).rejects.toThrow('Error deleting blog');
        });
    });


    // Your Blog
    describe('getBlogsByUser Id', () => {
        it('should fetch blogs by user ID successfully', async () => {
            const mockBlogs = [
                {
                    id: mockBlogId,
                    user_id: mockUserId,
                    email: mockEmail,
                    title: mockTitle,
                    content: mockContent,
                    banner_image: mockBannerImage,
                },
                {
                    id: 2,
                    user_id: mockUserId,
                    email: mockEmail,
                    title: 'User  Blog Title',
                    content: 'Content of user blog.',
                    banner_image: 'user-image.jpg',
                },
            ];

            pool.query.mockResolvedValueOnce({ rows: mockBlogs }); // Mock the database response

            const result = await getBlogsByUserId(mockUserId);
            expect(result).toEqual(mockBlogs);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockUserId]);
        });

        it('should return an empty array if no blogs found for user ID', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no blogs found

            const result = await getBlogsByUserId(mockUserId);
            expect(result).toEqual([]); // Expect an empty array
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(getBlogsByUserId(mockUserId)).rejects.toThrow('Error fetching blogs by user ID');
        });
    });
});