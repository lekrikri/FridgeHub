import { Router } from "express";
import {
    addItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItemByName,
    deleteItems,
} from "../controllers/pantry.controller";
import authMiddleware  from "../middlewares/auth.middleware";

const router = Router();

router.post('/', authMiddleware, addItem);
router.get('/', authMiddleware, getAllItems);
router.get('/:id', authMiddleware, getItemById);
router.patch('/:id', authMiddleware, updateItem);
router.delete('/bulk', authMiddleware, deleteItems);
router.delete('/', authMiddleware, deleteItemByName);

export default router;