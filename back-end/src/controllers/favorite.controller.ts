import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import FavoriteModel from "../models/favorite.model";
import { IFavorite } from "../interfaces/favorite.interface";

interface AuthRequest extends Request {
	user?: { id: string };
}

/**
 * @description Fetch all favorites
 * @method get
 * @route api/v1/favorite/
 * @param req
 * @param res
 */
const getAllFavorite = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const userId = req.user?.id;

		try {
			const favorite: IFavorite[] = await FavoriteModel.find({ userId });
			res.status(200).json({ success: true, data: favorite });
		} catch (error) {
			res.status(500).json({ success: false, message: error });
		}
	}
);

/**
 * @description Fetch a specific favorite
 * @method get
 * @route api/v1/favorite/:id
 * @param req
 * @param res
 */
const getFavoriteById = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;

		try {
			const favoriteId: IFavorite | null = await FavoriteModel.findById(
				id
			);
			if (!favoriteId) {
				res.status(404).json({
					success: false,
					message: "FavoriteModel not found",
				});
			} else {
				res.status(200).json({ success: true, data: favoriteId });
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
 * @description Add a favorite
 * @method post
 * @route api/v1/favorite/
 * @param req
 * @param res
 */
const addFavorite = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const { recipeId } = req.body;

		try {
			if (!recipeId) {
				res.status(400).json({
					success: false,
					message: "No recipe added in favorite",
				});
				return;
			}

			const existingFavorite = await FavoriteModel.findOne({
				userId: req.user?.id,
				recipeId,
			});

			if (existingFavorite) {
				res.status(200).json({
					success: false,
					message: "Recipe already in favorites",
				});
				return;
			}

			const newItem: IFavorite = await FavoriteModel.create({
				userId: req.user?.id,
				recipeId,
			});

			res.status(201).json({ success: true, data: newItem });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Update a specific favorite
 * @method patch
 * @route api/v1/favorite/:id
 * @param req
 * @param res
 */
const updateFavorite = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const updateFavorite: IFavorite | null =
				await FavoriteModel.findByIdAndUpdate(req.params.id, req.body, {
					new: true,
				});

			if (!updateFavorite) {
				res.status(404).json({
					success: false,
					message: "FavoriteModel recipe not found",
				});
			} else {
				res.status(200).json({ success: true, data: updateFavorite });
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
 * @description Delete multiple favorite recipes
 * @method delete
 * @route api/v1/favorite
 * @param req
 * @param res
 */
const deleteFavorite = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;

		try {
			const favorite = await FavoriteModel.findById(id);

			if (!favorite) {
				res.status(404).json({
					success: false,
					message: `Favorite with id: ${id} not found`,
				});
			}

			await FavoriteModel.findByIdAndDelete(favorite);

			res.status(200).json({
				success: true,
				message: `Favorite with id: ${id} deleted successfully`,
			});
			
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

export {
	addFavorite,
	getAllFavorite,
	getFavoriteById,
	updateFavorite,
	deleteFavorite,
};