import { Router } from "express";
import { isUserAuthenticated } from "../../middlewares/userAuthMiddleware.js";
import { getVendor } from "../controllers/getVendor.controller.js";
const vendorRouter = Router();
vendorRouter.use(isUserAuthenticated)
vendorRouter.get("/getVendorAuth",getVendor)

  

export {vendorRouter}     