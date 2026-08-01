import express from "express";
import { logs } from "../../../utils/logger.js";
import { sendMessageMail } from "../controllers/sendMail.controller.js";
const emailRouter = express.Router();

emailRouter.post("/sendMessageMail",sendMessageMail)

export {emailRouter}