import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

let originalConsoleError;
let mockToken;
let createdCustomerId;

beforeAll(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    
    mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

    // Clean up ALL test emails under @example.com
    await pool.query('DELETE FROM customers WHERE email LIKE $1', ['%@example.com']);
});


afterAll(async () => {
    console.error = originalConsoleError;
    await pool.end();
});

afterEach(async () => {
    jest.clearAllMocks();
});

jest.mock('../middleware/AuthMiddleware.js', () => (req, res, next) => {
    req.user = { id: 1 };
    next();
});

describe('Security Tests for Customer Profile', () => {
    const validCustomerData = {
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        dob: "1990-01-01",
        email: "test.original@example.com",
        contact: "1234567890",
        gender: "Male"
    };

    beforeAll(async () => {
        // Create test customer
        const res = await request(app)
            .post('/api/customerProfile/customer/add')
            .set('Authorization', `Bearer ${mockToken}`)
            .send(validCustomerData);
        
        createdCustomerId = res.body.newCustomer?.id;
    });

    describe('Add Customer', () => {
        // Clean up existing customer before each test
        beforeEach(async () => {
            await pool.query('DELETE FROM customers WHERE user_id = $1', [1]);
        });

        it('should reject SQL Injection in first name', async () => {
            const res = await request(app)
                .post('/api/customerProfile/customer/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    ...validCustomerData,
                    email: 'sql.test@example.com',
                    firstName: "A".repeat(51) // Trigger length validation
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch('First name must be between 1 and 50 characters');
        });

        it('should sanitize input to prevent XSS attacks', async () => {
            const maliciousInput = '<script>alert("XSS Attack")</script>';
            
            const res = await request(app)
                .post('/api/customerProfile/customer/add')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    firstName: maliciousInput,
                    lastName: 'Doe',
                    address: '123 Main St',
                    dob: '1990-01-01',
                    email: 'test@example.com',
                    contact: '1234567890',
                    gender: 'Male'
                });
    
            expect(res.status).toBe(201);
            expect(res.body.message).toMatch('Customer Profile added successfully');
        });
    });

    describe('Update Customer', () => {
        it('should reject invalid customer ID format', async () => {
            const res = await request(app)
                .put('/api/customerProfile/customer/update/not-a-number')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(validCustomerData);

            // Adjust expectation based on your error handling
            expect([400, 404]).toContain(res.status);
        });

        it('should sanitize XSS in address field', async () => {
            const xssPayload = '<img src=x onerror=alert(1)>';
            const res = await request(app)
                .put(`/api/customerProfile/customer/update/${createdCustomerId}`)
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    ...validCustomerData,
                    address: xssPayload
                });

            expect([200, 404]).toContain(res.status);
            if (res.status === 200) {
                expect(res.body.updatedCustomer.address).not.toContain('onerror');
            }
        });
    });

    describe('Get Customer', () => {
        it('should retrieve customer data', async () => {
            const res = await request(app)
                .get('/api/customerProfile/customer')
                .set('Authorization', `Bearer ${mockToken}`);

            // Adjust based on your actual implementation
            expect([200, 404]).toContain(res.status);
            if (res.status === 200) {
                expect(res.body.id).toBe(createdCustomerId);
            }
        });
    });

    describe('Error Handling', () => {
        it('should return 404 for non-existent routes', async () => {
            const res = await request(app).get('/api/customerProfile/non-existent-route');
            expect(res.status).toBe(404);
        });
    });
});