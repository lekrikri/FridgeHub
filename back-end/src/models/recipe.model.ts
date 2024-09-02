import mongoose, { Model, Schema } from "mongoose";
import { IRecipe } from "../interfaces/recipe.interface";

const RecipeSchema: Schema<IRecipe> = new Schema({
	title: { type: String, required: true },
	totalTime: { type: Number, required: true },
	rating: { type: Number, required: true },
	image: { type: String, required: false },
	description: { type: String, required: true },
	kcal: { type: Number, required: true },
	difficulty: { type: String, required: true },
	// step: [{ type: String, required: true }],
	step: [
		{
		title: { type: String },
		instructions: [{ type: String, required: true }],
		}
	],
	ingredients: [
		{
			ingredient: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Ingredient",
			},
			quantity: { type: String },
			metric: { type: String },
		},
		{ _id: false },
	],
	ustensils: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ustensil",
		},
	],
});

const Recipe: Model<IRecipe> = mongoose.model("recipe", RecipeSchema);

export default Recipe;
