import request from "supertest";
import express, { Application } from "express";
import {
	getAllIngredients,
	getIngredientById,
} from "../controllers/ingredient.controller";
import Ingredient from "../models/ingredient.model";
import ingredientModel from "../models/ingredient.model";

const app: Application = express();
app.use(express.json());

app.get("/api/v1/ingredient/", getAllIngredients);
app.get("/api/v1/ingredient/:id", getIngredientById);

jest.mock("../models/ingredient.model");

describe("Ingredient Controller", () => {
	describe("GET /api/v1/ingredient/", () => {
		it("should fetch all ingredients", async () => {
			(Ingredient.find as jest.Mock).mockResolvedValue([
				{ name: "Salt", quantity: 1 },
			]);
			const res = await request(app).get("/api/v1/ingredient/");
			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data).toEqual([{ name: "Salt", quantity: 1 }]);
		});

		it("should 500 if cannot fetch data", async () => {
			(ingredientModel.find as jest.Mock).mockImplementationOnce(() => {
				throw new Error("Database error");
			});

			const res = await request(app).get("/api/v1/ingredient");

			expect(res.status).toBe(500);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toEqual(
				"Server error: Error: Database error"
			);
		});
	});

	describe("GET /api/v1/ingredient/:id", () => {
		it("should fetch a specific ingredient", async () => {
			const ingredient = { name: "Salt", quantity: 1 };
			(Ingredient.findById as jest.Mock).mockResolvedValue(ingredient);
			const res = await request(app).get("/api/v1/ingredient/1");
			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data).toEqual(ingredient);
		});

		it("should return 404 if ingredient not found", async () => {
			(Ingredient.findById as jest.Mock).mockResolvedValue(null);

			const res = await request(app).get("/api/v1/ingredient/1");

			expect(res.status).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Ingredient not found");
		});

		it("should return 500 if there is server error", async () => {
			(Ingredient.findById as jest.Mock).mockImplementationOnce(() => {
				throw new Error("Server error");
			});

			const res = await request(app).get("/api/v1/ingredient/1");

			expect(res.status).toBe(500);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Server error: Error: Server error");
		});
	});
});
