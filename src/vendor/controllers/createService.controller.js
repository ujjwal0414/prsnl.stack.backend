import mongoose from "mongoose";
import asyncHandler from "express-async-handler"
import { logs } from "../../../utils/logger.js";
import { sendResponse } from "express-res-handler";
const createServide = asyncHandler(async(req,resp)=>{
    const serviceData = req.body;
    sendResponse(resp,200,true,serviceData,"Service created")
})
export {createServide}