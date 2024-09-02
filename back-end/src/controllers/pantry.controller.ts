import { Params } from './../../node_modules/@types/express-serve-static-core/index.d';
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IPantry } from "../interfaces/pantry.interface";
import PantryModel from "../models/pantry.model";

interface AuthRequest extends Request {
	user?: { id: string };
}

/**
 * @description Insert ingredient in the pantry
 * @method POST
 * @route api/v1/pantry/
 * @param req
 * @param res
 * @body ingredient_name, quantity, unit
 */
const addItem = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const { ingredient_name, quantity, unit } = req.body;

		try {
			if (!ingredient_name || !quantity || !unit) {
				res.status(400).json({ success: false, error: "Missing required fields" });
				return;
			}

			const newItem: IPantry = await PantryModel.create({
				user_id: req.user?.id,
				ingredient_name,
				quantity,
				unit,
			});

			res.status(201).json({
				success: true,
				message: "Item added to pantry",
				item: newItem,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: `Error adding item to pantry: ${error}` });
		}
	}
);

/**
 * @description Get all ingredients in the pantry
 * @method GET
 * @route api/v1/pantry/
 * @param req
 * @param res
 */
const getAllItems = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		try {
			if (!req.user || !req.user.id) {
				res.status(401).json({ success: false, message: "Unauthorized" });
				return;
			}

			const items = await PantryModel.find({ user_id: req.user.id });

			res.status(200).json({
				success: true,
				items,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Get a specific ingredient in the pantry
 * @method GET
 * @route api/v1/pantry/:id
 * @param req
 * @param res
 */
const getItemById = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const { id } = req.params;
		try {
			if (!req.user || !req.user.id) {
				res.status(401).json({ success: false, message: "Unauthorized" });
				return;
			}

			const item = await PantryModel.findById(id);

			if (!item || item.user_id.toString() !== req.user.id) {
				res.status(404).json({ success: false, message: "Item not found" });
				return;
			}

			res.status(200).json({
				success: true,
				item,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Remove multiple items from the pantry
 * @method DELETE
 * @route api/v1/pantry/
 * @param req
 * @param res
 */
const deleteItems = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const { id } = req.body;

		try {
			if (!Array.isArray(id) || id.length === 0) {
				res.status(400).json({ success: false, message: "Invalid or empty id array" });
				return;
			}

			const result = await PantryModel.deleteMany({
				_id: { $in: id },
				user_id: req.user?.id,
			});

			if (result.deletedCount === 0) {
				res.status(404).json({ success: false, message: "No items found to delete" });
				return;
			}

			res.status(200).json({
				success: true,
				message: "Items deleted successfully",
				deletedCount: result.deletedCount,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Remove item from the pantry using ingredient name
 * @method DELETE
 * @route api/v1/pantry
 * @param req.query.ingredient_name
 */
const deleteItemByName = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const ingredient_name = req.query.ingredient_name;

		try {
			if (!ingredient_name) {
				res.status(400).json({ success: false, message: "Invalid or empty ingredient_name" });
				return;
			}

			const result = await PantryModel.deleteOne({ ingredient_name: ingredient_name, user_id: req.user?.id });

			if (result.deletedCount === 0) {
				res.status(404).json({ success: false, message: "Item not found to delete" });
				return;
			}

			res.status(200).json({
				success: true,
				message: `Item with ingredient_name: ${ingredient_name} deleted successfully`,
				deletedCount: result.deletedCount,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Update specific item in the pantry
 * @method PATCH
 * @route api/v1/pantry/:id
 * @param req
 * @param res
 */
const updateItem = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const { id } = req.params;
		const { ingredient_name, quantity, unit } = req.body;

		try {
			if (!req.user || !req.user.id) {
				res.status(401).json({ success: false, message: "Unauthorized" });
				return;
			}

			const item = await PantryModel.findById(id);

			if (!item) {
				res.status(404).json({ success: false, message: "Item not found." });
				return;
			}

			if (item.user_id.toString() !== req.user.id) {
				res.status(401).json({ success: false, message: "Unauthorized. Item does not belong to user." });
				return;
			}

			item.ingredient_name = ingredient_name;
			item.quantity = quantity;
			item.unit = unit;

			const updatedItem = await item.save();

			res.status(200).json({
				success: true,
				item: updatedItem,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: `Server error: ${error}` });
		}
	}
);

export {
	addItem,
	getAllItems,
	getItemById,
	deleteItems,
	deleteItemByName,
	updateItem,
};

