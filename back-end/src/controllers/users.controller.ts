import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser } from "../interfaces/user.interface";
import UserModel from "../models/users.model";
import bcrypt from "bcryptjs";
import { log } from "winston";

interface AuthRequest extends Request {
	user?: { id: string };
}

/**
 * @description Get all Users
 * @route api/v1/user/
 * @param req
 * @param res
 */
const getUserInfo = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const userId: string | undefined = req.user?.id;

		try {
			const user: IUser[] | null = await UserModel.findById(userId);
			res.status(200).json({ success: true, data: user });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Get User by Id
 * @route api/v1/user/:id
 * @param req
 * @param res
 */
const getUserByIdController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const id: string = req.params.id;

			const user: IUser | null = await UserModel.findById(id);
			if (!user) {
				res.status(404).json({
					success: false,
					message: "User not found",
				});
			} else {
				res.status(200).json({ success: true, data: user });
			}
		} catch (error) {
			res.status(500).json({
				success: true,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Update User
 * @route api/v1/user
 * @param req
 * @param res
 */
const updateUser = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const userId = req.user?.id;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
			return;
		}

		// Extract user fields from the request body
		const { password, weight, height, preferences } = req.body;

		// Prepare an update object
		const updateData: Partial<IUser> = {};

		if (password) {
			const salt = await bcrypt.genSalt(10);
			updateData.password = await bcrypt.hash(password, salt);
		}

		if (weight !== undefined) {
			updateData.weight = weight;
		}

		if (height !== undefined) {
			updateData.height = height;
		}

		if (preferences) {
			// Ensure preferences are correctly structured
			updateData.preferences = {
				dietaryRestrictions: preferences.dietaryRestrictions || [],
				favoriteCuisines: preferences.favoriteCuisines || [],
				cookingSkillLevel: preferences.cookingSkillLevel || "beginner", // Set a default if not provided
			};
		}

		// Check if there's anything to update
		if (Object.keys(updateData).length === 0) {
			res.status(400).json({
				success: false,
				message: "No data provided to update",
			});
			return;
		}

		try {
			// Update the user document
			const updatedUser = await UserModel.findByIdAndUpdate(
				userId,
				updateData,
				{
					new: true,
					runValidators: true,
				}
			);

			if (!updatedUser) {
				res.status(404).json({
					success: false,
					message: "User not found",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "User updated",
				user: updatedUser,
			});
		} catch (error) {
			console.error("Error updating user:", error);
			res.status(500).json({
				success: false,
				message: "Server error",
				error: error,
			});
		}
	}
);

/**
 * @description Delete User
 * @route api/v1/user
 * @param req
 * @param res
 */
const deleteUserController = asyncHandler(
	async (req: AuthRequest, res: Response): Promise<void> => {
		const userId: string | undefined = req.user?.id;

		try {
			await UserModel.findByIdAndDelete(userId);

			res.status(200).json({
				success: true,
				message: `User ${userId} deleted`,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Server error",
				error,
			});
		}
	}
);

export { getUserInfo, getUserByIdController, updateUser, deleteUserController };
