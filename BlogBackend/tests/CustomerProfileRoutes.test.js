// tests/customerProfileRoutes.test.js
import request from 'supertest';
import app from '../index.js'; // Adjust the path to your main app file
import { pool } from '../config/db.js'; // Import the database pool

// Mock the database functions
jest.mock('../config/db.js');

// Mock the auth middleware
jest.mock('../middleware/AuthMiddleware.js', () => (req, res, next) => {
    req.user = { id: 1 }; // Mock user ID
    next();
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
    jest.clearAllMocks(); // Clear mock data after each test
});

describe('Customer Profile Routes', () => {
    // Test for getting a customer
    describe('GET /customer', () => {
        it('should return a customer profile', async () => {
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

            // Mock the database response
            pool.query.mockResolvedValueOnce({ rows: [mockCustomer] });

            const response = await request(app)
                .get('/api/customerProfile/customer') // Adjust the route as necessary
                .set('Authorization', 'Bearer your_token_here'); // Mock the auth token

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCustomer);
        });

        it('should return 404 if customer not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no customer found

            const response = await request(app)
                .get('/api/customerProfile/customer') // Adjust the route as necessary
                .set('Authorization', 'Bearer your_token_here'); // Mock the auth token

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Customer not found' });
        });
    });

    // Test for adding a new customer
    describe('POST /customer/add', () => {
        it('should add a new customer', async () => {
            const newCustomer = {
                firstName: 'Jane',
                lastName: 'Doe',
                address: '456 Elm St',
                dob: '1992-02-02',
                email: 'jane.doe@example.com',
                contact: '0987654321',
                gender: 'Female'
            };

            // Mock the database response
            pool.query.mockResolvedValueOnce({ rows: [{ id: 2, ...newCustomer }] });

            const response = await request(app)
                .post('/api/customerProfile/customer/add') // Adjust the route as necessary
                .set('Authorization', 'Bearer your_token_here') // Mock the auth token
                .send(newCustomer);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Customer Profile added successfully', newCustomer: { id: 2, ...newCustomer } });
        });

        it('should return 400 if validation fails', async () => {
            const invalidCustomer = {
                firstName: '', // Invalid first name
                lastName: 'Doe',
                address: '456 Elm St',
                dob: '1992-02-02',
                email: 'jane.doe@example.com',
                contact: '0987654321',
                gender: 'Female'
            };

            const response = await request(app)
                .post('/api/customerProfile/customer/add') // Adjust the route as necessary
                .set('Authorization', 'Bearer your_token_here') // Mock the auth token
                .send(invalidCustomer);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('First name must be between 1 and 50 characters');
        });
    });

     // Test for updating a customer
    describe('PUT /customer/update/:id', () => {
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

            // Mock the database response for an existing customer
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedCustomer }] });

            const response = await request(app)
                .put('/api/customerProfile/customer/update/1') // Adjust the route as necessary
                .set('Authorization', 'Bearer your_token_here') // Mock the auth token
                .send(updatedCustomer);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Customer profile updated successfully', updatedCustomer: { id: 1, ...updatedCustomer } });
        });

        it('should return 404 if customer not found during update', async () => {
            // Simulate no customer found by returning an empty result
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no customer found
        
            const response = await request(app)
                .put('/api/customerProfile/customer/update/999') // Non-existent ID
                .set('Authorization', 'Bearer your_token_here') // Mock the auth token
                .send({
                    firstName: 'Jane',
                    lastName: 'Doe',  
                    email: 'jane.doe@example.com', 
                    contact: '0987654321', 
                    gender: 'Female' 
                });
        
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Customer not found');
        });

        it('should return 400 if validation fails', async () => {
            const invalidCustomer = {
                firstName: '', // Invalid first name
                lastName: 'Doe',
                address: '456 Elm St',
                dob: '1992-02-02',
                email: 'jane.doe@example.com',
                contact: '0987654321',
                gender: 'Female'
            };

            const response = await request(app)
                .put('/api/customerProfile/customer/update/1') // Adjust the route as necessary
                .set('Authorization', 'Bearer your_token_here') // Mock the auth token
                .send(invalidCustomer);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('First name must be between 1 and 50 characters');
        });
    });
});