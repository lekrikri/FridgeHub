import { Router } from "express";
import {
    getUserInfo,
    updateUser,
    deleteUserController
} from '../controllers/users.controller'
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUserInfo);
router.patch("/", authMiddleware, updateUser);
router.delete("/", authMiddleware, deleteUserController);

export default router;