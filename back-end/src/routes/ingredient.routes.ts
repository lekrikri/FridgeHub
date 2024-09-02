import { Router } from "express";
import { getAllIngredients, getIngredientById, searchIngredients } from "../controllers/ingredient.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get('/search', authMiddleware, searchIngredients);
router.get('/:id', authMiddleware, getIngredientById);
router.get('/', authMiddleware, getAllIngredients);



export default router;
