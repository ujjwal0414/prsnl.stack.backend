import asyncHandler from "express-async-handler";
import { Mailer } from "../../../utils/mailer.js";

const login = asyncHandler(async(req,resp)=>{
    const mailer = new Mailer(process.env.SMTP_USER,process.env.SMTP_PASS)
    const instanceCheck = await mailer.checkInstance();
    resp.send({
        data:instanceCheck
    })
})
export {login}