import nodemailer from "nodemailer"
import welcomeEmail from "../email-template/welcomeEmail.js";
import cancelMembership from "../email-template/cancelMembership.js";

const sendMail = async (option, next) =>{
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port : parseInt(process.env.SMTP_PORT || "587"),
            service : process.env.SMTP_SERVICE,
            secure : true,
            auth : {
                user : process.env.SMTP_EMAIL,
                pass : process.env.SMTP_PASSWORD
            }
        })

        const {email, subject, type ,data} = option;

        let html; 


        if(type == "welcome"){
            html = welcomeEmail(data.username, "Nawaya Early Access", email)
        }

        else if(type == "cancel membership"){
            html = cancelMembership(data.username, data.email)
        }

        console.log("Sending mail to : ", email);

        const mailOptions= {
            from  : process.env.SMTP_EMAIL, 
            to : email,
            subject,
            html 
        };

    
    await transporter.sendMail(mailOptions);
    console.log("Email sent to ", email);
    next();

    }
    catch(e){
        console.log("Error message", e)
    }
}


export default sendMail;