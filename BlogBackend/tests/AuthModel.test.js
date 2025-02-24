import { pool } from '../config/db.js';
import { createUser , findEmail, deleteAccount } from '../models/AuthModel.js';
import { addBloggersByAdmin, getBloggerInfo, updateBloggerById, deleteBloggerById } from '../models/AuthModel.js';

jest.mock('../config/db.js');  // Mock the database query function

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



describe('AuthModel Tests', () => {
    // Registration
    describe('User  Creation', () => {
        it('should create a new user', async () => {
            const mockUser   = { id: 1, username: 'testUser  ', email: 'test@example.com', password: 'hashedPassword' };
            pool.query.mockResolvedValueOnce({ rows: [mockUser  ] }); // Mock the database response

            const result = await createUser ('testUser  ', 'test@example.com', 'hashedPassword', 'blogger');

            expect(result).toEqual(mockUser  ); // Check if the result matches the mock user
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                ['testUser  ', 'test@example.com', 'hashedPassword', 'blogger'] // Check the parameters passed to the query
            );     
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

            await expect(createUser ('testUser  ', 'test@example.com', 'hashedPassword', 'blogger')).rejects.toThrow('Database error');
        });
    });




    // Login
    describe('User  Retrieval', () => {
        it('should find a user by email', async () => {
            const mockUser   = { id: 1, username: 'testUser  ', email: 'test@example.com' };
            pool.query.mockResolvedValueOnce({ rows: [mockUser  ] });

            const result = await findEmail('test@example.com');

            expect(result).toEqual(mockUser  ); 
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['test@example.com']); // Ensure the query was called with the correct email
        });    

        it('should return undefined if user is not found by email', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no user found

            const result = await findEmail('nonexistent@example.com');

            expect(result).toBeUndefined(); // Expect undefined when no user is found
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['nonexistent@example.com']);
        });
    });





    // Delete Account
    describe('Account Deletion', () => {
        it('should delete a user account successfully', async () => {
            const mockUser   = { id: 1, username: 'testUser   ', email: 'test@example.com' };
            pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockUser  ] }); // Simulate successful deletion

            const result = await deleteAccount(mockUser .id); // Call the deleteAccount function

            expect(result).toEqual(mockUser  ); // Check if the result matches the mock user
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM users'),
                [mockUser .id] // Check the parameters passed to the query
            );
        });

        it('should return null if user not found during deletion', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 }); // Simulate no user found

            const result = await deleteAccount(999); // Attempt to delete a non-existent user

            expect(result).toBeNull(); // Expect null when no user is found
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM users'),
                [999] // Check the parameters passed to the query
            );
        });

        it('should throw an error if database query fails during deletion', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

            await expect(deleteAccount(1)).rejects.toThrow('Could not delete account. Please try again.'); 
        });
    });






    // Admin
    describe('Admin Blogger Model Tests', () => {
        // Test for creating a new blogger
        it('should create a new blogger', async () => {
            const newBlogger = { username: 'newBlogger', email: 'newBlogger@example.com', password: 'hashedPassword' };
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...newBlogger }] }); // Mock the database response

            const result = await addBloggersByAdmin(newBlogger.username, newBlogger.email, newBlogger.password);
            
            expect(result).toEqual({ id: 1, ...newBlogger });
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                [newBlogger.username, newBlogger.email, newBlogger.password]
            );
        });

        // Test for fetching bloggers
        it('should fetch all bloggers', async () => {
            const mockBloggers = [
                { id: 1, username: 'blogger1', email: 'blogger1@example.com' },
                { id: 2, username: 'blogger2', email: 'blogger2@example.com' },
            ];
            pool.query.mockResolvedValueOnce({ rows: mockBloggers }); // Mock the database response

            const result = await getBloggerInfo();
            
            expect(result).toEqual(mockBloggers);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT id, username, email FROM users'));
        });

        // Test for updating a blogger
        it('should update an existing blogger', async () => {
            const updatedBlogger = { username: 'updatedBlogger', email: 'updatedBlogger@example.com' };
            pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, ...updatedBlogger }] }); // Mock the database response

            const result = await updateBloggerById(1, updatedBlogger);
            
            expect(result).toEqual({ id: 1, ...updatedBlogger });
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE users SET'),
                expect.arrayContaining([updatedBlogger.username, updatedBlogger.email, 1])
            );
        });

        // Test for deleting a blogger
        it('should delete a blogger', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 1 }); // Mock the database response for successful deletion

            const result = await deleteBloggerById(1);
            
            expect(result.rowCount).toBe(1);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM users WHERE id = $1'),
                [1]
            );
        });

        // Test for handling not found when deleting a blogger
        it('should return 0 when blogger not found', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 }); // Mock the database response for not found

            const result = await deleteBloggerById(999); // Non-existent ID
            
            expect(result.rowCount).toBe(0);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM users WHERE id = $1'),
                [999]
            );
        });
    });
});