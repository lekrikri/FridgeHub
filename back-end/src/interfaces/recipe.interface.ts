import mongoose, { Document } from 'mongoose';
import { IStep } from './step.interface';

export interface IRecipe extends Document {
    title: string;
    totalTime: number;
    rating: number;
    image: string;
    description: string;
    kcal: number;
    difficulty: string;
    step: IStep[];
    ingredients: mongoose.Types.ObjectId[];
    ustensils: mongoose.Types.ObjectId[];
}
