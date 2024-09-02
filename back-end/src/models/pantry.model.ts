import mongoose, { Schema, Model } from "mongoose";
import { IPantry } from "../interfaces/pantry.interface";

const PantryItemSchema: Schema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	ingredient_name: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	unit: {
		type: String,
		required: true,
	},
});

const Pantry: Model<IPantry> = mongoose.model<IPantry>("Pantry", PantryItemSchema);

export default Pantry;
