import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Ingredient from "../models/ingredient.model";
import { IIngredient } from "../interfaces/ingredient.interface";

/**
 * @description Fetch all ingredient
 * @method get
 * @route api/v1/ingredient/
 * @param req
 * @param res
 */
const getAllIngredients = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const ingredient: IIngredient[] = await Ingredient.find();
			res.status(200).json({ success: true, data: ingredient });
		} catch (error) {
			res.status(500).json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Fetch a specific ingredient
 * @method get
 * @route api/v1/ingredient/:id
 * @param req id
 * @param res
 */
const getIngredientById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	try {
		const ingredient = await Ingredient.findById(id);

		if (!ingredient) {
			res.status(404).json({
				success: false,
				message: "Ingredient not found",
			});
		} else {
			res.status(200).json({ success: true, data: ingredient });
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: `Server error: ${error}`,
		});
	}
};

/**
 * @description Create an ingredient
 * @method post
 * @route api/v1/ingredient/
 * @param req
 * @param res
 */
const createIngredient = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { name, quantity } = req.body;
		try {
			if (!name || !quantity) {
				res.status(400).json({
					success: false,
					message: "Name and quantity are required",
				});
				return;
			}

			const newIngredient: IIngredient = new Ingredient(req.body);
			const savedIngredient: IIngredient = await newIngredient.save();

			res.status(201).json({ success: true, data: savedIngredient });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Update a specific ingredient
 * @method patch
 * @route api/v1/ingredient/:id
 * @param req
 * @param res
 */
const updateIngredient = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const updatedIngredient: IIngredient | null =
				await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
					new: true,
				});

			if (!updatedIngredient) {
				res.status(404).json({
					success: false,
					message: "Ingredient not found",
				});
			} else {
				res.status(200).json({
					success: true,
					data: updatedIngredient,
				});
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
 * @description Delete a specific ingredient
 * @method delete
 * @route api/v1/ingredient/:id
 * @param req
 * @param res
 */
const deleteIngredient = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const deletedIngredient = await Ingredient.findByIdAndDelete(
				req.params.id
			);
			
			if (!deletedIngredient) {
				res.status(404).json({
					success: false,
					message: "Ingredient not found",
				});
			} else {
				res.status(200).json({
					success: true,
					message: "Ingredient deleted successfully",
				});
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
 * @description Search for ingredients by name
 * @method get
 * @route api/v1/ingredient/search
 * @param req
 * @param res
 */
const searchIngredients = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const query = req.query.query as string;
		try {
			if (!query || typeof query !== 'string') {
				res.status(400).json({ success: false, message: 'Query parameter is required and must be a string' });
				return;
			}

			const ingredients: IIngredient[] = await Ingredient.find({
				name: { $regex: new RegExp(query, 'i') }
			});

			res.status(200).json({ success: true, data: ingredients });
		} catch (error) {
			console.error('Error during ingredient search:', error);
			res.status(500).json({ success: false, message: 'Server error' });
		}
	}
);


export { getAllIngredients, getIngredientById, searchIngredients };
