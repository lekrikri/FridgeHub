import dotenv from "dotenv";
// import * as fs from "fs";
import mongoose from "mongoose";
// import * as path from "path";

// import Ingredient from "../models/ingredient.model";
// import Recipe from "../models/recipe.model";
// import Ustensil from "../models/ustensil.model";

// const filePath = path.join(__dirname, "../models/recipes.json");
// const recipesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

dotenv.config();

// const parseQuantity = (quantityString: string) => {
// 	const match = quantityString.match(/(\d+)(\D*)/);
// 	if (match) {
// 		return {
// 			quantity: match[1],
// 			metric: match[2].trim(),
// 		};
// 	}
// 	return {
// 		quantity: quantityString,
// 		metric: "",
// 	};
// };

const connectDB = async () => {
	try {
		const uri = process.env.MONGO_URL;
		if (!uri) {
			throw new Error("MongoDB connection URI missing in .env file");
		}

		await mongoose.connect(uri)
		// .then(async () => {
		// 	// await Recipe.deleteMany({});
		// 	// await Ingredient.deleteMany({});
		// 	// await Ustensil.deleteMany({});

		// 	const ingredientMap = new Map();
		// 	const ustensilMap = new Map();

		// 	for (const recipe of recipesData) {
		// 		const ingredientIds = [];
		// 		const ustensilIds = [];
        
		// 		for (const ingredient of recipe.ingredients) {
		// 			const { quantity, metric } = parseQuantity(
		// 				ingredient.quantity
		// 			);
		// 			let existingIngredient = ingredientMap.get(ingredient.name);
		// 			if (!existingIngredient) {
		// 				const newIngredient = new Ingredient({
		// 					name: ingredient.name,
		// 					image: ingredient.image,
		// 				});
		// 				existingIngredient = await newIngredient.save();
		// 				ingredientMap.set(ingredient.name, existingIngredient);
		// 			}
		// 			ingredientIds.push({
		// 				ingredient: existingIngredient._id,
		// 				quantity,
		// 				metric,
		// 			});
		// 		}

		// 		for (const ustensil of recipe.ustensils) {
		// 			const key = ustensil.name;
		// 			let existingUstensil = ustensilMap.get(key);
		// 			if (!existingUstensil) {
		// 				const newUstensil = new Ustensil(ustensil);
		// 				existingUstensil = await newUstensil.save();
		// 				ustensilMap.set(key, existingUstensil);
		// 			}
		// 			ustensilIds.push(existingUstensil._id);
		// 		}

		// 		const newRecipe = new Recipe({
		// 			...recipe,
		// 			ingredients: ingredientIds,
		// 			ustensils: ustensilIds,
		// 		});
		// 		await newRecipe.save();
		// 	}
		// });

		console.log("MongoDB connected");
	} catch (err) {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	}
};

export default connectDB;
