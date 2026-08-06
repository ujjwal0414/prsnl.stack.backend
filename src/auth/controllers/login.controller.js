import asyncHandler from "express-async-handler";
import { Mailer } from "../../../utils/mailer.js";
import { logs } from "../../../utils/logger.js";
import { sendResponse } from "express-res-handler";
import { userLoginZodSchema, userZodSchema } from "../schemas/user.zod.js";
import bcrypt from "bcrypt"
import { userModel } from "../schemas/user.schema.js";
import { generateRefreshToken } from "../../../utils/generateToken.js";
const login = asyncHandler(async(req,resp)=>{
    const validateData = userLoginZodSchema.safeParse(req.body);
    
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
                const refreshToken = generateRefreshToken(getUserDetails.userEmail)
                return sendResponse(resp,200,true,{refreshToken:refreshToken},"User found");
            }else{
            return sendResponse(resp,403,true,null,"Password did not match");
            }
        }
    })
})
export {login}