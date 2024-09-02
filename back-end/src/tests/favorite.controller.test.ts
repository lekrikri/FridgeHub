import request from "supertest";
import express from "express";
import asyncHandler from "express-async-handler";
import {
	addFavorite,
	getAllFavorite,
	getFavoriteById,
	deleteFavorite,
} from "../controllers/favorite.controller";
import FavoriteModel from "../models/favorite.model";
import Recipe from "../models/recipe.model";

const app = express();
app.use(express.json());

app.post("/api/v1/favorite/", addFavorite);
app.get("/api/v1/favorite/", getAllFavorite);
app.get("/api/v1/favorite/:id", getFavoriteById);
app.delete("/api/v1/favorites/:id", deleteFavorite);

jest.mock("../models/favorite.model");

describe("Favorite API", () => {
	describe("GET /api/v1/favorite/", () => {
		it("should return status 200 and fetch all favorites", async () => {
			const favorites = [{ id: "1", recipeId: "recipe1" }];
			(FavoriteModel.find as jest.Mock).mockResolvedValue(favorites);

			const res = await request(app).get("/api/v1/favorite/");

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data).toEqual(favorites);
		});

		it("should 500 if cannot fetch data", async () => {
			(FavoriteModel.find as jest.Mock).mockImplementationOnce(() => {
				throw new Error("Database error");
			});

			const res = await request(app).get("/api/v1/favorite");

			expect(res.status).toBe(500);
			expect(res.body.success).toBe(false);
			expect(res.body).toEqual({
				success: false,
				message: {},
			});
		});
	});

	describe("GET /api/v1/favorite/:id", () => {
		it("should fetch a specific favorite by id", async () => {
			const mockFavorite = {
				id: "66aa9ad45ac9516e103c418e",
				recipeId: "66aa9ac95ac9516e103c3d7b",
			};
			(FavoriteModel.findById as jest.Mock).mockResolvedValue(
				mockFavorite
			);

			const res = await request(app).get(
				"/api/v1/favorite/66aa9ad45ac9516e103c418e"
			);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data).toEqual(mockFavorite);
		});

		it("should return 404 if favorite not found", async () => {
			(FavoriteModel.findById as jest.Mock).mockResolvedValue(null);

			const res = await request(app).get("/api/v1/favorite/x");

			expect(res.status).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("FavoriteModel not found");
		});

		it("should return 500 if got server internal error", async () => {
			(FavoriteModel.findById as jest.Mock).mockImplementationOnce(() => {
				throw new Error("Server error");
			});

			const res = await request(app).get("/api/v1/favorite/1");

			expect(res.status).toBe(500);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Server error: Error: Server error");
		});
	});

	describe("POST /api/v1/favorite/", () => {
		it("should return 200 and create a new favorite entity", async () => {
			const newFavorite = {
				id: "1",
				recipeId: "recipe1",
				userId: "user1",
			};
			(FavoriteModel.create as jest.Mock).mockResolvedValue(newFavorite);

			const res = await request(app)
				.post("/api/v1/favorite/")
				.send({ recipeId: "recipe1" });

			expect(res.status).toBe(201);
			expect(res.body.success).toBe(true);
			expect(res.body.data).toEqual(newFavorite);
		});

		it("should return 400 if recipeId is not provided", async () => {
			(FavoriteModel.findById as jest.Mock).mockResolvedValue(null);

			const res = await request(app).post("/api/v1/favorite/").send({});

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("No recipe added in favorite");
		});

		it("should return 500 if internal server error", async () => {
			(FavoriteModel.create as jest.Mock).mockImplementationOnce(() => {
				throw new Error(`Server error`);
			});

			const res = await request(app)
				.post("/api/v1/favorite")
				.send({ recipeId: "recipe1" });

			expect(res.status).toBe(500);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe(`Server error: Error: Server error`);
		});
	});

	describe("DELETE /api/v1/favorites/:id", () => {
		it("should return 200 and delete a favorite by id", async () => {
			const mockFavorite = {
				id: "66aa9ad45ac9516e103c418e",
				recipeId: "66aa9ac95ac9516e103c3d7b",
			};

			(FavoriteModel.findById as jest.Mock).mockResolvedValue(mockFavorite);
			(FavoriteModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockFavorite);

			const res = await request(app).delete("/api/v1/favorites/66aa9ad45ac9516e103c418e");

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.message).toBe(`Favorite with id: 66aa9ad45ac9516e103c418e deleted successfully`);
		});

		it("should return 404 if favorite with given id is not found", async () => {
			(FavoriteModel.findById as jest.Mock).mockResolvedValue(null);

			const res = await request(app).delete("/api/v1/favorites/66aa9ad45ac9516e103c418e");

			expect(res.status).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe(`Favorite with id: 66aa9ad45ac9516e103c418e not found`);
		});

		it("should return 500 if an internal server error occurs", async () => {
			(FavoriteModel.findById as jest.Mock).mockImplementationOnce(() => {
				throw new Error("Server error");
			});

			const res = await request(app).delete("/api/v1/favorites/66aa9ad45ac9516e103c418e");

			expect(res.status).toBe(500);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Server error: Error: Server error");
		});
	});
});