import { Document } from "mongoose";

export interface IUstensil extends Document {
    name: string;
    image: string;
}
