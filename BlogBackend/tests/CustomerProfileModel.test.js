import { pool } from '../config/db.js';
import { addCustomer, getCustomerByUserId, updateCustomer, deleteCustomer } from '../models/CustomerProfileModel.js';

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

describe('Customer Model Tests', () => {
    // Test for adding a new customer
    describe('Add Customer', () => {
        it('should add a new customer', async () => {
            const newCustomer = {
                userId: 1,
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                dob: '1990-01-01',
                email: 'john.doe@example.com',
                contact: '1234567890',
                gender: 'Male'
            };
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...newCustomer }] }); // Mock the database response

            const result = await addCustomer(
                newCustomer.userId,
                newCustomer.firstName,
                newCustomer.lastName,
                newCustomer.address,
                newCustomer.dob,
                newCustomer.email,
                newCustomer.contact,
                newCustomer.gender
            );

            expect(result).toEqual({ id: 1, ...newCustomer });
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO customers'),
                [
                    newCustomer.userId,
                    newCustomer.firstName,
                    newCustomer.lastName,
                    newCustomer.address,
                    newCustomer.dob,
                    newCustomer.email,
                    newCustomer.contact,
                    newCustomer.gender
                ]
            );
        });

        it('should throw an error if database query fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

            await expect(addCustomer(1, 'John', 'Doe', '123 Main St', '1990-01-01', 'john.doe@example.com', '1234567890', 'Male')).rejects.toThrow('Could not add customer.');
        });
    });

    // Test for retrieving a customer by user ID
    describe('Get Customer', () => {
        it('should retrieve a customer by user ID', async () => {
            const mockCustomer = {
                id: 1,
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                address: '123 Main St',
                dob: '1990-01-01',
                email: 'john.doe@example.com',
                contact: '1234567890',
                gender: 'Male'
            };
            pool.query.mockResolvedValueOnce({ rows: [mockCustomer] }); // Mock the database response

            const result = await getCustomerByUserId(1);

            expect(result).toEqual(mockCustomer);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]); // Ensure the query was called with the correct user ID
        });

        it('should return undefined if customer is not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no customer found

            const result = await getCustomerByUserId(999); // Non-existent user ID

            expect(result).toBeUndefined(); // Expect undefined when no customer is found
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [999]);
        });
    });

    // Test for updating a customer
    describe('Update Customer', () => {
        it('should update an existing customer', async () => {
            const updatedCustomer = {
                firstName: 'Jane',
                lastName: 'Doe',
                address: '456 Elm St',
                dob: '1992-02-02',
                email: 'jane.doe@example.com',
                contact: '0987654321',
                gender: 'Female'
            };
            pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, ...updatedCustomer }] }); // Mock the database response

            const result = await updateCustomer(
                1,
                updatedCustomer.firstName,
                updatedCustomer.lastName,
                updatedCustomer.address,
                updatedCustomer.dob,
                updatedCustomer.email,
                updatedCustomer.contact,
                updatedCustomer.gender
            );

            expect(result).toEqual({ id: 1, ...updatedCustomer });
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE customers'),
                expect.arrayContaining([1, updatedCustomer.firstName, updatedCustomer.lastName, updatedCustomer.address, updatedCustomer.dob, updatedCustomer.email, updatedCustomer.contact, updatedCustomer.gender])
            );
        });

        it('should throw an error if customer not found during update', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 }); // Simulate no customer found

            await expect(updateCustomer(999, 'Jane', 'Doe', '456 Elm St', '1992-02-02', 'jane.doe@example.com', '0987654321', 'Female')).rejects.toThrow('Could not update customer.'); // Expect an error to be thrown
        });

        it('should throw an error if database query fails during update', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate a database error

            await expect(updateCustomer(1, 'Jane', 'Doe', '456 Elm St', '1992-02-02', 'jane.doe@example.com', '0987654321', 'Female')).rejects.toThrow('Could not update customer.'); 
        });
    }); 
});