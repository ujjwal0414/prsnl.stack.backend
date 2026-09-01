import { sendResponse } from "express-res-handler";
import asyncHandler from "express-async-handler";
import { logs } from "../../../utils/logger.js";
import { userModel } from "../../auth/schemas/user.schema.js";
import { Mailer } from "../../../utils/mailer.js";
const getRecepientMail = (recpt) => {
    switch(recpt){
        case "admin":
            return process.env.ADMIN_EMAIL
            break;
        case "tech":
            return process.env.TECH_EMAIL
            break;
        case "sales":
            return process.env.SALES_EMAIL
            break;
        default:
            return process.env.DEFAULT_EMAIL
            
    }
}
const pushNotification = asyncHandler(async(req,resp)=>{
    const {from,message,subject,n_type,recipient} = req.body;
    if(!from || !subject || !message) return sendResponse(resp,403,false,null,"Empty fields detected")
    const userDetails = await userModel.findOne({userEmail:from});
    if(!userDetails) return sendResponse(resp,404,false,null,"No such user exists in our database")
    logs.info(req.body)
    let recepient_mail = getRecepientMail(recipient);
    const mailer = new Mailer(process.env.SMTP_USER,process.env.SMTP_PASS);
    const mess = `Respected Sir/Madam,

User [${from}] wants to seek your help with your expertise. The following message has been attached:

${message}

Thank you,
Team ToolBox`;
    const {accepted,rejected,messageId} = await mailer.sendMessage(recepient_mail,subject,mess);
    

    if(n_type == "contactus"){

    }
    return sendResponse(resp,200,true,{accepted,rejected,messageId},"message sent")
})
export {pushNotification}