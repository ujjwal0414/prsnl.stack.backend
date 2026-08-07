import { Router } from "express";
import { isUserAuthenticated } from "../../middlewares/userAuthMiddleware.js";
import { getClient } from "../controllers/getClient.controller.js";
const clientRouter = Router();
clientRouter.use(isUserAuthenticated)
clientRouter.get("/getClientAuth",getClient)


export {clientRouter}