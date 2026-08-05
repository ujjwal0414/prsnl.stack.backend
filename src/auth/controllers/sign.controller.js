import asyncHandler from "express-async-handler";
import { userModel } from "../schemas/user.schema.js";
import { userZodSchema } from "../schemas/user.zod.js";
import { logs } from "../../../utils/logger.js";
import { sendResponse } from "express-res-handler";
const signUp = asyncHandler(async(req,resp)=>{
    const {userEmail,password,phone} = req.body;
    const validData = await userZodSchema.safeParseAsync(req.body);
    if(!validData.success){
        return resp.status(403).send({
            success:false,
            data:validData?.error?.issues,
            message:"Could not verify credentials"
        })
    }
    const checkUserExistence = await userModel.findOne({userEmail})
    if(checkUserExistence){
        return resp.status(403).send({
            success:false,
            data:null,
            message:"User already present"
        })
        
    }
    if(process.env.BACKEND_ENV == "dev"){
        const checkPhoneNos = await userModel.findOne({phone});
        if(checkPhoneNos){
            return sendResponse(resp,403,false,null,"Phone number already registered")
        }
    }
    const createUser = new userModel(req.body);
    const saveData = await createUser.save();
    return resp.status(201).send({
            success:false,
            data:saveData,
            message:"User Created"
        })
})
export {signUp}