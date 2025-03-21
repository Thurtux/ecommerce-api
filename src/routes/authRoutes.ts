import { Router } from "express";
import { registerUser, loginUser, registerAdmin, loginAdmin } from "../controllers/authController";
import { validateRegister, validateLogin } from "../middlewares/authValidation";
import { handleValidationErrors } from "../middlewares/handleValidation";

const router = Router();

// Rotas para usuários comuns
router.post("/register", validateRegister, handleValidationErrors, registerUser);
router.post("/login", validateLogin, handleValidationErrors, loginUser);

// Rotas para administradores
router.post("/admin/register", validateRegister, handleValidationErrors, registerAdmin);
router.post("/admin/login", validateLogin, handleValidationErrors, loginAdmin);

export default router;
