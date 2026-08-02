import asyncHandler from "express-async-handler";
import { Mailer } from "../../../utils/mailer.js";

import { logs } from "../../../utils/logger.js";

import { sendResponse } from "express-res-handler";
import { userZodSchema } from "../schemas/user.zod.js";
import bcrypt from "bcrypt"
import { userModel } from "../schemas/user.schema.js";
const login = asyncHandler(async(req,resp)=>{
    const validateData = userZodSchema.safeParse(req.body);
    if(!validateData.success){
        sendResponse(resp,403,false,validateData?.error?.issues,"Credentials does not match some criteria");
        return
    }
    const {userEmail,password} = req.body;
    const getUserDetails = await userModel.findOne({userEmail});
    if(!getUserDetails){
        sendResponse(resp,404,false,getUserDetails,"No user found with this Email");
        return
    }
    bcrypt.compare(password,getUserDetails?.password,(err,result)=>{
        logs.info(`Password result is ${result}`)
        if(err){
            sendResponse(resp,406,false,null,"Error occured while matching password");
            return
        }else{
            if(result){
                sendResponse(resp,200,true,null,"User found");
            }else{
            sendResponse(resp,200,true,null,"Password did not match");
            }
        }
    })
})
export {login}