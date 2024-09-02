import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../interfaces/user.interface"

const UserSchema: Schema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		weight: Number,
		height: Number,
		preferences: {
			dietaryRestrictions: [String],
			favoriteCuisines: [String],
			cookingSkillLevel: {
				type: String,
				enum: ['beginner', 'intermediate', 'advanced'],
			},
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;