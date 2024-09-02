import mongoose, { Schema } from "mongoose";
import { IFavorite } from "../interfaces/favorite.interface";

const FavoriteRecipeSchema: Schema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFavorite>("Favorite", FavoriteRecipeSchema);
