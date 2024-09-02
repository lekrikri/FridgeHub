import mongoose, { Document } from "mongoose";

export interface IFavorite extends Document {
	userId: mongoose.Types.ObjectId;
	recipeId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}
