import { Router } from "express";
import {
	getAllRecipes,
	getRecipeById,
	searchRecipes,
	createRecipe, deleteRecipe,
} from "../controllers/recipe.controller";
import {
	generateRecipe,
} from "../controllers/createRecipe.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();


router.get("/search", authMiddleware, searchRecipes);
router.get("/:id", authMiddleware, getRecipeById);
router.post("/", authMiddleware, createRecipe);
router.get("/", authMiddleware, getAllRecipes);
router.delete("/:id", authMiddleware, deleteRecipe);

router.post("/generate-recipes", authMiddleware, generateRecipe);

export default router;