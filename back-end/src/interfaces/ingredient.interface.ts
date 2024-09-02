import { Document } from "mongoose";

export interface IIngredient extends Document {
    name: { type: String, required: true },
    image: { type: String },
}
