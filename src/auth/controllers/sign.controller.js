import asyncHandler from "express-async-handler";
import { userModel } from "../schemas/user.schema.js";
import { userZodSchema } from "../schemas/user.zod.js";
import { logs } from "../../../utils/logger.js";
import { sendResponse } from "express-res-handler";
import { generateRefreshToken } from "../../../utils/generateToken.js";
const signUp = asyncHandler(async(req,resp)=>{
    const {userEmail,password,phone,role,os} = req.body;
    logs.info(req.body)
    const userData = {userEmail,password,phone,role};
    const validData = await userZodSchema.safeParseAsync(userData);
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
    if(process.env.BACKEND_ENV == "prod"){
        const checkPhoneNos = await userModel.findOne({phone});
        if(checkPhoneNos){
            return sendResponse(resp,403,false,null,"Phone number already registered")
        }
    }
    const createUser = new userModel(userData);
    const saveData = await createUser.save();
    const refreshToken = generateRefreshToken(saveData.userEmail);
    const updateUserSession = await userModel.findOneAndUpdate({userEmail},{
        $push:{
            sessions:{
                $each:[{refreshToken:refreshToken,os:os}],
                $slice:process.env.ALLOWED_SESSIONS || 3
            }
        }
    })
    return resp.status(201).send({
            success:false,
            data:{...saveData,refreshToken:refreshToken,...updateUserSession},
            message:"User Created"
        })
})
export {signUp}