import { Router } from "express";
import { isUserAuthenticated } from "../../middlewares/userAuthMiddleware.js";
import { getAdmin } from "../controllers/getClient.controller.js";
const adminRouter = Router();
adminRouter.use(isUserAuthenticated)
adminRouter.get("/getAdmin",getAdmin)

export {adminRouter}