import asyncHandler from "express-async-handler";
import { userModel } from "../schemas/user.schema.js";
import { userZodSchema } from "../schemas/user.zod.js";
import { logs } from "../../../utils/logger.js";
import { sendResponse } from "express-res-handler";
const signUp = asyncHandler(async(req,resp)=>{
    const {userEmail,password} = req.body;
    const validData = await userZodSchema.safeParseAsync({
        userEmail:userEmail,
        password:password
    });
    if(!validData.success){
        sendResponse(resp,403,false,validData?.error?.issues,"Could not verify credentials");
    }
    const checkUserExistence = await userModel.findOne({userEmail})
    if(checkUserExistence){
        sendResponse(resp,403,false,checkUserExistence,"User already present")
        return
    }
    const createUser = await userModel.insertOne({userEmail,password});
    sendResponse(resp,201,true,createUser,"User created successfully")
})
export {signUp}