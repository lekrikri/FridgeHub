import request from "supertest";
import express, { Application } from "express";
import {
	registerUserController,
	loginUserController,
} from "../controllers/auth.controller";
import UserModel from "../models/users.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth";

jest.mock("../models/users.model");
jest.mock("bcryptjs");
jest.mock("../utils/auth")

const app: Application = express();
app.use(express.json());
app.post("/api/v1/auth/register", registerUserController);
app.post("/api/v1/auth/login", loginUserController);

describe("Auth Controller", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("registerUserController", () => {
		it('should return 400 if username, email, or password is missing', async () => {
			const response = await request(app)
				.post('/api/v1/auth/register')
				.send({ username: 'testuser', email: 'test@example.com' });
	
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				success: false,
				message: 'Username, email, and password are required',
			});
		});
	
		it('should return 400 if user already exists', async () => {
			(UserModel.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
	
			const response = await request(app)
				.post('/api/v1/auth/register')
				.send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
	
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				success: false,
				message: 'User already exists',
			});
		});
	
		it('should return 201 and create a new user', async () => {
			(UserModel.findOne as jest.Mock).mockResolvedValue(null);
			(bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
			(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
			(UserModel.create as jest.Mock).mockResolvedValue({
				username: 'testuser',
				email: 'test@example.com',
				password: 'hashedPassword',
				toObject: function() {
					return {
						username: 'testuser',
						email: 'test@example.com',
						password: 'hashedPassword',
					};
				},
			});
	
			const response = await request(app)
				.post('/api/v1/auth/register')
				.send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
	
			expect(response.status).toBe(201);
			expect(response.body).toEqual({
				success: true,
				message: 'User created',
				user: {
					username: 'testuser',
					email: 'test@example.com',
				},
			});
		});
	
		it('should return 500 if there is a server error', async () => {
			(UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
	
			const response = await request(app)
				.post('/api/v1/auth/register')
				.send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
	
			expect(response.status).toBe(500);
			expect(response.body).toEqual({
				success: false,
				message: 'Server error: Error: Database error',
			});
		});
	});
	
	describe('loginUserController', () => {
		let req: Partial<Request>;
		let res: Partial<Response>;
		let statusMock: jest.Mock;
		let jsonMock: jest.Mock;
	
		beforeEach(() => {
			jest.clearAllMocks();
		});
	
		afterEach(() => {
			jest.clearAllMocks();
		});
		it('should return 400 if email or password are missing', async () => {
			const response = await request(app)
				.post('/api/v1/auth/login')
				.send({ });
	
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				success: false,
				message: 'Email or password are required',
			});
		});
	});
});
