import { Router } from "express";
import {
	addFavorite,
	getAllFavorite,
	getFavoriteById,
	deleteFavorite,
} from "../controllers/favorite.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, addFavorite);
router.get("/", authMiddleware, getAllFavorite);
router.get("/:id", authMiddleware, getFavoriteById);
router.delete("/:id", authMiddleware, deleteFavorite);

export default router;