import mongoose from "mongoose";
import asyncHandler from "express-async-handler"
import { logs } from "../../../utils/logger.js";
import { sendResponse } from "express-res-handler";
import { VendorModel } from "../schemas/vendor.model.js";
const createServide = asyncHandler(async(req,resp)=>{
    const serviceData = req.body;
    const {serviceID,userEmail} = req.body;
    const vendorProfile = await VendorModel.findOne({vendorEmail:userEmail});
    if(!vendorProfile){
        return sendResponse(resp,404,false,null,"No vendor found for which service can be created.")
    }
    const {subscription,services,verificationStatus} = vendorProfile;
    const rejectionSet = ["pending","rejected","suspended"]
    if(rejectionSet.some((x)=> x==verificationStatus)) return sendResponse(resp,403,false,null,`Sorry your account is currently in ${verificationStatus} state.`)
    if(subscription=="basic" && services.length >= 3) return sendResponse(resp,403,false,null,"Upgrade from basic plan to create new service.")
    if(subscription=="premium" && services.length >=5) return sendResponse(resp,403,false,null,"Upgrade from premium plan to create new service.")
    
    const pushService = await VendorModel.updateOne({
        vendorEmail:userEmail
    },{
        $push:{
            services:req.body.serviceCreationData
        }
    },{
        upsert:true
    });
    return sendResponse(resp,201,true,pushService,"Service Created")
})
export {createServide}