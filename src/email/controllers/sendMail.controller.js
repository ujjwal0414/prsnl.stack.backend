import asyncHandler from 'express-async-handler'
import { Mailer } from '../../../utils/mailer.js'
import fs from 'fs'
import path from 'path'
const sendMessageMail = asyncHandler(async(req,resp)=>{
    const { to, subject,message } = req.body;
    const mailer = new Mailer(process.env.SMTP_USER,process.env.SMTP_PASS);
    const {accepted,rejected,messageId} = await mailer.sendMessage(to,subject,message);
    resp.send({status:201,accepted,rejected,messageId})
})
const sendPageMail = asyncHandler(async(req,resp)=>{
    const { to,subject,message,htmlContent } = req.body;
    if(!htmlContent){
        const 
    }
})
export {sendMessageMail}