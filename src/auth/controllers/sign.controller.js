import asyncHandler from "express-async-handler";
import { userModel } from "../schemas/user.schema.js";
import { userZodSchema } from "../schemas/user.zod.js";
import { logs } from "../../../utils/logger.js";
const signUp = asyncHandler(async(req,resp)=>{
    const {userEmail,password} = req.body;
    const validData = await userZodSchema.safeParseAsync({
        userEmail:userEmail,
        password:password
    });
    if(!validData.success){
        resp.status(403).send({
            message:"Validation failed",
            data:validData?.error?.issues
        })
    }
    const checkUserExistence = await userModel.findOne({userEmail})
    if(checkUserExistence){
        resp.status(203).send({
            message:"User already present",
            data:checkUserExistence
        })
        return
    }
    const createUser = await userModel.insertOne({userEmail,password});
    resp.status(201).send({
        message:"User created successfully",
        data:createUser
    })
})
export {signUp}