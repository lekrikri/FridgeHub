import { Router } from "express";
import {
	createUstensil,
	getAllUstensils,
	getUstensilById,
} from "../controllers/ustensil.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getAllUstensils);
router.get("/:id", authMiddleware, getUstensilById);
router.post("/", authMiddleware, createUstensil);

export default router;
