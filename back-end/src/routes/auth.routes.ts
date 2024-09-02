import { Router } from "express";
import { 
    registerUserController,
    loginUserController
} from '../controllers/auth.controller'

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);

export default router;
