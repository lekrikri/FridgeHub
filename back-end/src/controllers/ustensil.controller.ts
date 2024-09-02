import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Ustensil from "../models/ustensil.model";

/**
 * @description Get all ustensils
 * @method get
 * @route api/v1/ustensil
 * @param req
 * @param res
 */
const getAllUstensils = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const ustensils = await Ustensil.find();
			res.status(200).json({ success: true, data: ustensils });
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Get a specific ustensil
 * @method get
 * @route api/v1/ustensil/:id
 * @param req.params.id
 * @param res
 */
const getUstensilById = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const ustensil = await Ustensil.findById(req.params.id);
			if (!ustensil) {
				res.status(404).json({ success: false, message: "Ustensil not found" });
			} else {
				res.status(200).json({ success: true, message: `Ustensil found`, data: ustensil });
			}
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Add a ustensil
 * @method post
 * @route api/v1/ustensil
 * @param req.body
 * @param res
 */
const createUstensil = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const newUstensil = new Ustensil(req.body);
			const savedUstensil = await newUstensil.save();
			res.status(201).json({ success: true, data: savedUstensil });
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Update a ustensil
 * @method patch
 * @route api/v1/ustensil/:id
 * @param req.params.id
 * @param res
 */
const updateUstensil = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const updatedUstensil = await Ustensil.findByIdAndUpdate(
				req.params.id,
				req.body,
				{ new: true }
			);
			if (!updatedUstensil) {
				res.status(404).json({ success: false, message: "Ustensil not found" });
			} else {
				res.status(200).json({ success: true, data: updatedUstensil });
			}
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: `Server error: ${error}` });
		}
	}
);

/**
 * @description Delete a ustensil
 * @method delete
 * @route api/v1/ustensil/:id
 * @param req.params.id
 * @param res
 */
const deleteUstensil = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const deletedUstensil = await Ustensil.findByIdAndDelete(req.params.id);
			if (!deletedUstensil) {
				res.status(404).json({ success: false, message: "Ustensil not found" });
			} else {
				res
					.status(200)
					.json({ success: true, message: "Ustensil deleted successfully" });
			}
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: `Server error: ${error}` });
		}
	}
);

export {
	createUstensil,
	getAllUstensils,
	getUstensilById,
};
