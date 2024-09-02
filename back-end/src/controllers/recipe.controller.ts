import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Recipe from "../models/recipe.model";
import { IRecipe } from "../interfaces/recipe.interface";

/**
 * @description Get all recipes
 * @method get
 * @route api/v1/recipes
 * @param req
 * @param res
 */
const getAllRecipes = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const recipes = await Recipe.find();
			res.status(200).json({ success: true, data: recipes });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Get a specific recipe
 * @method get
 * @route api/v1/recipe/:id
 * @param req
 * @param res
 */
const getRecipeById = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const recipe = await Recipe.findById(req.params.id);
			if (!recipe) {
				res.status(404).json({
					success: false,
					message: "Recipe not found",
				});
			} else {
				res.status(200).json({ success: true, data: recipe });
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Create a recipe
 * @method post
 * @route api/v1/recipe
 * @param req.body
 * @param res
 */
const createRecipe = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const {
				title,
				totalTime,
				rating,
				image,
				description,
				kcal,
				difficulty,
				step,
				ingredients,
				ustensils,
			} = req.body;

			const newRecipe: IRecipe = new Recipe({
				title,
				totalTime,
				rating,
				image,
				description,
				kcal,
				difficulty,
				step,
				ingredients,
				ustensils,
			});
			const savedRecipe: IRecipe = await newRecipe.save();
			res.status(201).json({ success: true, data: savedRecipe });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Update a specific recipe
 * @method patch
 * @route api/v1/recipe
 * @param req.params.id
 * @param req.body
 * @param res
 */
const updateRecipe = async (req: Request, res: Response): Promise<void> => {
	try {
		const updatedRecipe = await Recipe.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedRecipe) {
			res.status(404).json({
				success: false,
				message: "Recipe not found",
			});
		} else {
			res.status(200).json({ success: true, data: updatedRecipe });
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: `Server error: ${error}`,
		});
	}
};

/**
 * @description Delete a specific recipe
 * @method delete
 * @route api/v1/recipe
 * @param req.params.id
 * @param res
 */
const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
	try {
		const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
		if (!deletedRecipe) {
			res.status(404).json({
				success: false,
				message: "Recipe not found",
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Recipe deleted successfully",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: `Server error: ${error}`,
		});
	}
};

/**
 * @description Search for recipes by title
 * @method get
 * @route api/v1/recipe/search
 * @param req
 * @param res
 */
const searchRecipes = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const query = req.query.query as string;
		try {
			if (!query || typeof query !== "string") {
				res.status(400).json({
					success: false,
					message: "Query parameter is required and must be a string",
				});
				return;
			}

			const recipes: IRecipe[] = await Recipe.find({
				title: { $regex: new RegExp(query, "i") },
			});

			res.status(200).json({ success: true, data: recipes });
		} catch (error) {
			console.error("Error during recipe search:", error);
			res.status(500).json({ success: false, message: "Server error" });
		}
	}
);

export {
	getAllRecipes,
	getRecipeById,
	createRecipe,
	updateRecipe,
	searchRecipes,
	deleteRecipe,
};
