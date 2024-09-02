import mongoose, { Schema } from 'mongoose';
import { IUstensil } from '../interfaces/ustensil.interface';

const UstensilSchema: Schema = new Schema({
    image: { type: String },
    name: { type: String, required: true }
});

export default mongoose.model<IUstensil>('ustensil', UstensilSchema);
