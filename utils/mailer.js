import nodemailer from "nodemailer"
import { logs } from "./logger.js";
class Mailer {
    constructor(user, app_pass) {
        this.smtp_user = user;
        this.app_pass = app_pass;
        this.transporter = null;
    }
    async checkInstance() {
        if(!this.app_pass || !this.smtp_user) return {
            isActive: false,
            data:"Not a valid credentials",
            user:this.smtp_user,
            pass:this.app_pass
        }
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
            auth: {
                user: this.smtp_user,
                pass: this.app_pass,
            },
        });
        if (!this.transporter) return {
            isActive: false,
            data:"No transporter instance found"
        };
        try {
            await this.transporter.verify();
            return {
                isActive:true,
                data:"Instance ready"
            }
        } catch (err) {
            return {
                isActive:false,
                data:err
            }
        }
    }
}


export {Mailer}