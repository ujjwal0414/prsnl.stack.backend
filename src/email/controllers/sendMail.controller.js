import asyncHandler from 'express-async-handler'
import { Mailer } from '../../../utils/mailer.js'
const sendMessageMail = asyncHandler(async(req,resp)=>{
    const { to, subject,message } = req.body;
    const mailer = new Mailer(process.env.SMTP_USER,process.env.SMTP_PASS);
    const mailerInfo = await mailer.sendMessage(to,subject,message);
    resp.send(mailerInfo)
})

export {sendMessageMail}