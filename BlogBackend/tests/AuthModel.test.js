import { pool } from '../config/db.js';
import { createUser, findEmail, deleteAccount} from '../models/AuthModel.js';
  
jest.mock('../config/db.js');  // Mock the database query function


describe('AuthModel Tests', () => {
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


    it('should create a new user', async () => {
        const mockUser  = { id: 1, username: 'testUser ', email: 'test@example.com', password: 'hashedPassword' };
        pool.query.mockResolvedValueOnce({ rows: [mockUser ] }); // Mock the database response

        const result = await createUser ('testUser ', 'test@example.com', 'hashedPassword', 'blogger');

        expect(result).toEqual(mockUser ); // Check if the result matches the mock user
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            ['testUser ', 'test@example.com', 'hashedPassword', 'blogger'] // Check the parameters passed to the query
        );     
    });


    it('should find a user by email', async () => {
        const mockUser  = { id: 1, username: 'testUser ', email: 'test@example.com' };
        pool.query.mockResolvedValueOnce({ rows: [mockUser ] });

        const result = await findEmail('test@example.com');

        expect(result).toEqual(mockUser ); 
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['test@example.com']); // Ensure the query was called with the correct email
    });    


    it('should return undefined if user is not found by email', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no user found
    
        const result = await findEmail('nonexistent@example.com');
    
        expect(result).toBeUndefined(); // Expect undefined when no user is found
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['nonexistent@example.com']);
    });


    it('should throw an error if database query fails', async () => {
        pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error
    
        await expect(createUser ('testUser ', 'test@example.com', 'hashedPassword', 'blogger')).rejects.toThrow('Database error');
    });




    // Delete Account Tests
    it('should delete a user account successfully', async () => {
        const mockUser  = { id: 1, username: 'testUser  ', email: 'test@example.com' };
        pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockUser ] }); // Simulate successful deletion

        const result = await deleteAccount(mockUser.id); // Call the deleteAccount function

        expect(result).toEqual(mockUser ); // Check if the result matches the mock user
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM users'),
            [mockUser.id] // Check the parameters passed to the query
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