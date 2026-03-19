import { Router } from "express";
import { getMe, login, register, verifyEmail } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator , login )

/**
 * @route POST /api/auth/get-me
 * @desc get user
 * @access Private
 */
authRouter.get("/get-me", authUser , getMe)






/**
 * verify email
 */
authRouter.get("/varify-email", verifyEmail )



export default authRouter;