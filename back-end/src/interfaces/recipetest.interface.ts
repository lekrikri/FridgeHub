import mongoose, { Document } from 'mongoose';

export interface IRecipe extends Document {
    title: string;
    totalTime: number;
    rating: number;
    image: string;
    imageType: string;
    description: string;
    kcal: number;
    difficulty: string;
    step: string[];
    ingredients: mongoose.Types.ObjectId[];
    ustensils: mongoose.Types.ObjectId[];
}
