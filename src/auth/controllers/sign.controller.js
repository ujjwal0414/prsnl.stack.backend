import asyncHandler from "express-async-handler";
import { userModel } from "../schemas/user.schema.js";
const signUp = asyncHandler(async(req,resp)=>{
    const {userEmail,password} = req.body;

})