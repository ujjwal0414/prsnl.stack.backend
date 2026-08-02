import express from "express";
import { login } from "../controllers/login.controller.js";
import { signUp } from "../controllers/sign.controller.js";
const authRouter = express.Router();
authRouter.post("/login",login)
authRouter.post("/signUp",signUp)
export {authRouter}