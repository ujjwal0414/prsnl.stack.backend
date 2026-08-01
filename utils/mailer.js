import nodemailer from "nodemailer"
import { logs } from "./logger.js";
class Mailer {
    constructor(user, app_pass) {
        this.smtp_user = user;
        this.app_pass = app_pass;
        this.transporter = null;
    }
    async checkInstance() {
        if (!this.app_pass || !this.smtp_user) return {
            isActive: false,
            data: "Not a valid credentials",
            user: this.smtp_user,
            pass: this.app_pass
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
            data: "No transporter instance found"
        };
        try {
            await this.transporter.verify();
            return {
                isActive: true,
                data: "Instance ready"
            }
        } catch (err) {
            return {
                isActive: false,
                data: err
            }
        }
    }
    convertRecepients(to) {
        if (!Array.isArray(to)) return to;
        return to.join();
    }
    async sendMessage(to = [], subject = "demo subject", message = "demo message") {
        if (to.length == 0 || !subject || !message) throw new Error("Provide valid data for sending mail")
        const { isActive, data } = await this.checkInstance();
        if (!isActive) throw new Error(data)
        try {
            const info = this.transporter.sendMail({
                from: `"Ujjwal Gupta"<${this.smtp_user}>`,
                to: this.convertRecepients(to),
                subject: subject,
                text: message, 
            })
            return info
        } catch (error) {
            throw error
        }
    }

    async sendPagee(to = [], subject = "demo subject", htmlContent = "<b>Interesting to collaborate with nodemailer</b>",message="") {
        if (to.length == 0 || !subject ) throw new Error("Provide valid data for sending mail")
        const { isActive, data } = await this.checkInstance();
        if (!isActive) throw new Error(data)
        try {
            const info = this.transporter.sendMail({
                from: `"Ujjwal Gupta"<${this.smtp_user}>`,
                to: this.convertRecepients(to),
                subject: subject,
                text: message, 
                html:htmlContent
            })
            return info
        } catch (error) {
            throw error
        }
    }
}


export { Mailer }