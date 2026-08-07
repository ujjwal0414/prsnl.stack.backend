import asyncHandler from "express-async-handler";
import { sendResponse } from "express-res-handler";

import jwt from "jsonwebtoken"
import { userModel } from "../auth/schemas/user.schema.js";
const isUserAuthenticated = (async(req,response,next)=>{
    const authorizationheader = req.header("Authorization")
    if(!authorizationheader){
        return sendResponse(response,401,false,null,"No authorization header present");
    }
    try {
        const token = authorizationHeader.replace("Bearer ", "");
        const secret = process.env.REFRESH_TOKEN_KEY;
        const decodedData = jwt.decode(token,secret);
        const findUser = await userModel.findOne({
            userEmail:decodedData.userEmail
        },{
            sessions:{
                $elemMatch:{
                    refreshToken:token
                }
            }
        })
        if(!findUser){
            return sendResponse(response,401,false,null,"User unauthorized")
        }
        req.user = findUser;
        req.token = token;
        next();
    } catch (error) {
        return sendResponse(response,401,false,null,"Please authenticate")
    }
})
export {isUserAuthenticated}