import userModel from "../models/userData.js";
import ErrorHandler from "./ErrorHandler.js";
import Stripe from "stripe"
import sendMail from "./sendMail.js";

//Stripe credential setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const handlePaymentSucceeded = async (customerStripeId, next) => {

    try{
         let user2 = await userModel.findOneAndUpdate(
                { stripeCustomerId: customerStripeId },
                { 
                userType: 'premium',
                lastPaymentDate: Date.now() 
                }
            );

            console.log("Upgraded the account");
            console.log("Sending email to", user2.email);


            let option = {
                email : user2.email,
                subject : "Welcome To Nawaya",
                type : "welcome",
                data: {
                    username : user2.name,
                    email : user2.email
                }
            }

            sendMail(option, next)
            next();
    }
    catch(e){
        return next(new ErrorHandler("Invalid Token", 400));
    }
};

const handlePaymentFailed = async (customerStripeId, next) => {

    try{
        console.log("Payment incompleted, account downgraded")// let user2 = await userModel.findOneAndUpdate(
            let user2 = await userModel.findOneAndUpdate(
                { stripeCustomerId: customerStripeId },
                { 
                userType: 'waitlist', 
                }
            );
            
            console.log("Downgraded the account");
            console.log("Sending email to", user2.email);

            let option = {
                email : user2.email,
                subject : "Membership Expired",
                type : "cancel membership",
                data: {
                    username : user2.name,
                    email : user2.email
                }
            }

            sendMail(option, next)
            next();

    }
    catch(e){
        return next(new ErrorHandler("Invalid Token", 400));
    }
};

async function fetchCheckoutSession(customerId) {
    try {
        const sessions = await stripe.checkout.sessions.list({
            customer: customerId,
            limit: 1, // Assuming the most recent session is linked
        });

        console.log(sessions)

        if (sessions.data.length > 0) {
            return sessions.data[0]; // Return the most recent session
        }
    } catch (err) {
        console.error('Error fetching checkout session:', err.message);
    }

    return null;
}




export {handlePaymentSucceeded,handlePaymentFailed,fetchCheckoutSession}