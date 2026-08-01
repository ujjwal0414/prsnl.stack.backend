import asyncHandler from 'express-async-handler'
import { Mailer } from '../../../utils/mailer.js'
import fs from 'fs'
import path from 'path'
import { PROJECT_ROOT } from '../../../fileConfig.js'
const sendMessageMail = asyncHandler(async(req,resp)=>{
    const { to, subject,message } = req.body;
    const mailer = new Mailer(process.env.SMTP_USER,process.env.SMTP_PASS);
    const {accepted,rejected,messageId} = await mailer.sendMessage(to,subject,message);
    resp.send({status:201,accepted,rejected,messageId})
})
const sendPageMail = asyncHandler(async(req,resp)=>{
    let { to,subject,message,htmlContent,mode } = req.body;
    
    if(!mode) throw new Error("Select mode to send age")
    if(!htmlContent){
        if(mode == "welcome"){
            const filePath = path.join(PROJECT_ROOT,"public","WelcomePage.html")
            htmlContent = fs.readFileSync(filePath,'utf-8');
        } 
    }
    const mailer = new Mailer(process.env.SMTP_USER,process.env.SMTP_PASS);
    const {accepted,rejected,messageId} = await mailer.sendPage(to,subject,htmlContent,message);
    resp.send({status:201,accepted,rejected,messageId})
})
export {sendMessageMail,sendPageMail}