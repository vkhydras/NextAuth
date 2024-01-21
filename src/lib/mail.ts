import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { activationTemplate } from "./emailTemplates/activation";
import { resetPasswordTemplate } from "./emailTemplates/resetPass";
// require('dotenv').config();


export async function sendMail({ to, subject, body }: {
    to: string,
    subject: string,
    body: string
}) {
    const { SMTP_EMAIL, SMTP_GMAIL_PASS } = process.env;
    const transport = nodemailer.createTransport({
        service: "gmail",  
        port: 587,          
        secure: false,
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_GMAIL_PASS
        }
    });

    try {
        const testResult = await transport.verify();
        console.log(testResult);
    } catch (err) {
        console.log(err);
    }
    try {
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html: body
        })
        console.log({sendResult})
    } catch (error) {
        console.log(error)
    }
}

export function compileActivationTemplate(name:string, url:string){
    const template = Handlebars.compile(activationTemplate)
    const htmlBody = template({
        name,
        url,
    })
    return htmlBody
}

export function compileResetPassTemplate(name:string, url:string){
    const template = Handlebars.compile(resetPasswordTemplate)
    const htmlBody = template({
        name,
        url,
    })
    return htmlBody
}
