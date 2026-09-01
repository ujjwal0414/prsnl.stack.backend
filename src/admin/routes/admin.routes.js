import { Router } from "express";
import { isUserAuthenticated } from "../../middlewares/userAuthMiddleware.js";
import { getAdmin } from "../controllers/getClient.controller.js";
import { pushNotification } from "../controllers/pushNotification.controller.js";
const adminRouter = Router();
adminRouter.use(isUserAuthenticated)
adminRouter.get("/getAdminAuth",getAdmin)
adminRouter.post("/pushNotification",pushNotification)
export {adminRouter}