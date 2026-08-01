import express from "express";
import { logs } from "../../../utils/logger.js";
import { sendMessageMail,sendPageMail } from "../controllers/sendMail.controller.js";
const emailRouter = express.Router();

emailRouter.post("/sendMessageMail",sendMessageMail);
emailRouter.post("/sendPageMail",sendPageMail);
export {emailRouter}