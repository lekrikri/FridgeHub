import mongoose, { Schema } from "mongoose";
import { IIngredient } from "../interfaces/ingredient.interface";

const IngredientSchema: Schema = new Schema<IIngredient>({
  name: { type: String, required: true, unique: true },
  image: { type: String },
});

export default mongoose.model<IIngredient>("ingredient", IngredientSchema);
