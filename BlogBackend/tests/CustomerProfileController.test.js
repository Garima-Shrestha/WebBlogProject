import request from 'supertest';
import app from '../index.js';  // Ensure you import your Express app
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

jest.mock('../config/db.js');  // Mock the database query function

const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Customer Profile Controller Tests', () => {
    // Test for fetching customer details
    describe('GET /api/customerProfile/customer', () => {
        it('should fetch customer details successfully', async () => {
            const mockCustomer = {
                id: 1,
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                address: '123 Main St',
                dob: '1990-01-01',
                email: 'john.doe@example.com',
                contact: '1234567890',
                gender: 'Male',
            };

            pool.query.mockResolvedValueOnce({ rows: [mockCustomer] }); // Mock the database response

            const response = await request(app)
                .get('/api/customerProfile/customer')
                .set('Authorization', `Bearer ${mockToken}`); // Use the mockToken

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCustomer);
        });

        it('should return 404 if customer not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no customer found

            const response = await request(app)
                .get('/api/customerProfile/customer')
                .set('Authorization', `Bearer ${mockToken}`); // Use the mockToken

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Customer not found');
        });
    });

    // Test for adding a new customer profile
    describe('POST /api/customerProfile/customer/add', () => {
        it('should add a new customer profile successfully', async () => {
            const newCustomerData = {
                firstName: 'Jane',
                lastName: 'Doe',
                address: '456 Elm St',
                dob: '1992-02-02',
                email: 'jane.doe@example.com',
                contact: '0987654321',
                gender: 'Female',
            };

            pool.query.mockResolvedValueOnce({ rows: [{ id: 2, ...newCustomerData }] }); // Mock the database response

            const response = await request(app)
                .post('/api/customerProfile/customer/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(newCustomerData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Customer Profile added successfully');
            expect(response.body.newCustomer).toEqual(expect.objectContaining(newCustomerData));
        });

        it('should return 400 if validation fails', async () => {
            const invalidCustomerData = {
                firstName: '',
                lastName: 'Doe',
                address: '456 Elm St',
                dob: '1992-02-02',
                email: 'jane.doe@example.com',
                contact: '0987654321',
                gender: 'Female',
            };

            const response = await request(app)
                .post('/api/customerProfile/customer/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(invalidCustomerData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('First name must be between 1 and 50 characters');
        });
    });

    // Test for updating an existing customer profile
    describe('PUT /api/customerProfile/customer/update/:id', () => {
        it('should update an existing customer profile successfully', async () => {
            const updatedCustomerData = {
                firstName: 'Jane',
                lastName: 'Smith',
                address: '789 Oak St',
                dob: '1992-02-02',
                email: 'jane.smith@example.com',
                contact: '0987654321',
                gender: 'Female',
            };

            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedCustomerData }] }); // Mock the database response

            const response = await request(app)
                .put('/api/customerProfile/customer/update/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(updatedCustomerData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Customer profile updated successfully');
            expect(response.body.updatedCustomer).toEqual(expect.objectContaining(updatedCustomerData));
        });

        it('should return 404 if customer not found for update', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no customer found
        
            const response = await request(app)
                .put('/api/customerProfile/customer/update/999') // Non-existing ID
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    firstName: 'Jane',
                    lastName: 'Doe',
                    address: '123 Main St',
                    dob: '1990-01-01',
                    email: 'jane.doe@example.com',
                    contact: '1234567890',
                    gender: 'Female'
                });
        
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Customer not found');
        });
    });
});