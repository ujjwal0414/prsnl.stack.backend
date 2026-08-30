import asyncHandler from "express-async-handler";
import { Mailer } from "../../../utils/mailer.js";
import { logs } from "../../../utils/logger.js";
import { sendResponse } from "express-res-handler";
import { userLoginZodSchema, userZodSchema } from "../schemas/user.zod.js";
import bcrypt from "bcrypt"
import { userModel } from "../schemas/user.schema.js";
import { generateRefreshToken } from "../../../utils/generateToken.js";
import { VendorModel } from "../../vendor/schemas/vendor.model.js";
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
    bcrypt.compare(password,getUserDetails?.password,async (err,result)=>{
        logs.info(`Password result is ${result}`)
        if(err){
            sendResponse(resp,406,false,null,"Error occured while matching password");
            return
        }else{
            if(result){
                const usermail = getUserDetails?.userEmail;
                const role = getUserDetails?.role;
                let profileData = null;
                if(role=="vendor"){
                    profileData = await VendorModel.findOne({
                        vendorEmail:usermail
                    })
                }else if(role=="client"){

                }else if(role== "admin"){

                }else{
                
                }
                const refreshToken = generateRefreshToken(getUserDetails)
                return sendResponse(resp,200,true,{refreshToken:refreshToken,role:getUserDetails.role,profileData:profileData},"User found");
            }else{
            return sendResponse(resp,403,true,null,"Password did not match");
            }
        }
    })
})
export {login}