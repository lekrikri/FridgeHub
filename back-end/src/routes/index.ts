import { Router } from "express";

import authRouter from "./auth.routes";
import ingredientRouter from "./ingredient.routes";
import pantryRouter from "./pantry.routes";
import recipeRouter from "./recipe.routes";
import usersRouter from "./user.routes";
import ustensilRouter from "./ustensil.routes";
import favoriteRouter from "./favorite.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/pantry", pantryRouter);
router.use("/recipe", recipeRouter);
router.use("/ingredient", ingredientRouter);
router.use("/ustensil", ustensilRouter);
router.use("/favorite", favoriteRouter);

export default router;
