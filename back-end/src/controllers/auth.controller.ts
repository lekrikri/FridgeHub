import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/user.interface";
import UserModel from "../models/users.model";
import { generateToken } from "../utils/auth";

/**
 * @description Create User
 * @method post
 * @route POST api/v1/auth/register
 * @param req
 * @param res
 */
const registerUserController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { username, email, password }: IUser = req.body;

			if (!username || !email || !password) {
				res.status(400).json({
					success: false,
					message: "Username, email, and password are required",
				});
				return;
			}

			const existingUser = await UserModel.findOne({ email });
			if (existingUser) {
				res.status(400).json({
					success: false,
					message: "User already exists",
				});
				return;
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			const newUser = await UserModel.create({
				username,
				email,
				password: hashedPassword,
			});

			const { password: _, ...userWithoutPassword } = newUser.toObject();

			res.status(201).json({
				success: true,
				message: "User created",
				user: userWithoutPassword,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: `Server error: ${error}`,
			});
		}
	}
);

/**
 * @description Login User
 * @method post
 * @route api/v1/auth/login
 * @param req
 * @param res
 */
const loginUserController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				res.status(400).json({
					success: false,
					message: "Email or password are required",
				});
				return;
			}

			const existingUser: IUser | null = await UserModel.findOne({
				email,
			});
			if (!existingUser) {
				res.status(400).json({
					success: false,
					message: "Invalid email or password",
				});
				return;
			}

			const isPasswordMatch = await bcrypt.compare(
				password,
				existingUser.password
			);
			if (!isPasswordMatch) {
				res.status(400).json({
					success: false,
					message: "Invalid email or password",
				});
				return;
			}

			const token = generateToken(existingUser._id.toString());

			res.status(200).json({
				success: true,
				message: "User logged in successfully",
				token,
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

export { registerUserController, loginUserController };
