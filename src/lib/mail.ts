import nodemailer from "nodemailer";
require('dotenv').config();

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
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_GMAIL_PASS
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
