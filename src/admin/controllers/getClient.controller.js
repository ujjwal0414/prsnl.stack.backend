import asyncHandler from "express-async-handler"
import { userModel } from "../../auth/schemas/user.schema.js"
import { sendResponse } from "express-res-handler";
import { logs } from "../../../utils/logger.js";
const getAdmin = asyncHandler(async(req,resp)=>{
    
    const findUser = await userModel.findOne({});
    if(!findUser){
        return sendResponse(resp,404,false,null,"No admin found");
    }
    logs.info(req.decodedData)
    return sendResponse(resp,200,true,{role:req.user},"Found admin");
})
export {getAdmin}