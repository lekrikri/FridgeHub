import request from "supertest";
import express, { Application } from "express";
import {
	getUserInfo,
	updateUser,
	deleteUserController,
} from "../controllers/users.controller";
import UserModel from "../models/users.model";
import { IUser } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { mock } from "node:test";

jest.mock("../models/users.model");
jest.mock("bcryptjs");

interface AuthRequest extends Request {
	user?: { id: string };
}

const app: Application = express();
app.use(express.json());
app.use((req: AuthRequest, res, next) => {
	req.user = { id: "66bcd38b1497d1f511b02534" };
	next();
});

// Define routes for testing
app.get("/api/v1/user", getUserInfo);
app.put("/api/v1/user", updateUser);
app.delete("/api/v1/user", deleteUserController);

describe("User Controllers", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getUserInfo", () => {
		it("should return the user's info", async () => {
			app.use((req: AuthRequest, res, next) => {
				req.user = { id: "66bcd38b1497d1f511b02534"};
				next();
			});

			const mockUser = {
				id: "66bcd38b1497d1f511b02534",
			};
			
			(UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

			const response = await request(app).get(
				"/api/v1/user"
			);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toEqual(mockUser);
		});

		it("should return 404 if user not found", async () => {
			(UserModel.findById as jest.Mock).mockResolvedValue(null);

			const response = await request(app).get(
				"/api/v1/user"
			);

			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("User not found");
		});

		it("should handle server error", async () => {
			(UserModel.findById as jest.Mock).mockRejectedValue(
				new Error("Server error")
			);

			const response = await request(app).get(
				"/api/v1/user"
			);

			expect(response.status).toBe(500);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toContain("Server error");
		});
	});

	describe("deleteUserController", () => {
		it("should delete a user", async () => {
			app.use((req: AuthRequest, res, next) => {
				req.user = { id: "66bcd38b1497d1f511b02534"};
				next();
			});

			const mockUser = {
				id: "66bcd38b1497d1f511b02534",
			};

			(UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser.id);

			const response = await request(app).delete("/api/v1/user");

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("User 66bcd38b1497d1f511b02534 deleted");
		});

		it("should handle server error", async () => {
			(UserModel.findByIdAndDelete as jest.Mock).mockRejectedValue(
				new Error("Server error")
			);

			const response = await request(app).delete("/api/v1/user");

			expect(response.status).toBe(500);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Server error");
		});
	});
});
