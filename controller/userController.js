import ErrorHandler from "../utills/ErrorHandler.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Stripe from "stripe"
import moment from "moment"

// User database model 
import userModel from "../models/userData.js";
import { fetchCheckoutSession, handlePaymentFailed, handlePaymentSucceeded } from "../utills/handlePayments.js";

//Stripe credential setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



// Taking user survey input
const addServeryData = async(req, res,next) =>{

    try{
        const{
            name,
            email,
            seeking,
            areaOfInterest,
            languagePreferance,
            grow
        } = req.body;

        const password = process.env.PASSWORD;
        if(!name || !email ){
            return next(new ErrorHandler( "Please Enter all Details", 400))
        }
        if(!validator.isEmail(email)){
            return next(new ErrorHandler( "Please Enter valid Email.", 400))   
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(`${password}`, salt);

        console.log(password, hashedPassword)

        const userData = {
            name,
            email,
            seeking,
            password : hashedPassword,
            areaOfInterest,
            languagePreferance,
            grow
        };

        const newUser = new userModel(userData);
        await newUser.save();

        
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);
        res.status(200).json({status : "success", message : "Data Saved Successfully.", data:{token}});
    }
    catch(e){
        if(e.code ===  11000){
            return next(new ErrorHandler( "This email already exists.", 400))
        }
        return next(new ErrorHandler(e.message, 400));
    }
};


// User Login
const userLogin = async(req, res,next) =>{

    try{
        const{
            email,
            password
        } = req.body;

        console.log(req.body);

        const user = await userModel.findOne({email});

        if(!user){
            return next(new ErrorHandler( "User doen't exist.", 400))
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({id : user._id, email : user.email}, process.env.JWT_SECRET);
            res.status(200).json({status : "success", message : "Login Successfully." ,token})
        }
        else{
            return next(new ErrorHandler( "Wrong Email or Password.", 400))
        }

    }
    catch(e){
        if(e.code ===  11000){
            return next(new ErrorHandler( "This email already exists.", 400))
        }
        return next(new ErrorHandler(e.message, 400));
    }
};


// Admin Dashboard Login
const userDashboard = async(req, res,next) =>{

    try{
        res.status(200).json({status : 200, message : "Data Fetched successfully", data : []});
    }
    catch(e){
        return next(new ErrorHandler(e.message, 400));
    }
};


// const enableMembership  = async(req, res,next) =>{
//     try{
        
//        const {utoken} = req.headers;
//        console.log(utoken);
//     }
//     catch(e){
//         return next(new ErrorHandler(e.message, 400));
//     }
// };


async function enableMembership(req, res) {
    try {

        // Fetch professional data
        const {utoken} = req.headers;
        if (!utoken) throw new ErrorHandler("Token not found", 400);
        
        const token_decode = jwt.verify(utoken, process.env.JWT_SECRET);
            const user = await userModel.findOne({_id : token_decode.id}).select({password : 0});
            
            if(!user){
            return next(new ErrorHandler("Invalid Token", 400));
        }

         // Create or reuse Stripe customer
            let stripeCustomerId = user.stripeCustomerId;
            if(!stripeCustomerId){
            const customer = await stripe.customers.create({
                 email: user.email,
                 name: user.name,
             });
            stripeCustomerId = customer.id;
            user.stripeCustomerId = stripeCustomerId;
            await user.save();
            }

            console.log(user)
            
            
        // Generate Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: stripeCustomerId,
            line_items: [
                {
                    price: process.env.STRIPE_PRODUCT_ID, 
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.CLIENT_URI}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URI}/membership/fail`,
            metadata: {
                token : utoken
            },
        });


        res.status(200).json({
            status: "success",
            message: "Checkout session created",
            session : session?.url,
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
}


// const stripeWebHook = async(req, res,next) =>{
//     try{
//         const sig = req.headers['stripe-signature'];
//           let event;
//             try {
//                 // Verify event signature
//                 event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//             } catch (err) {
//                 return res.status(400).send(`Webhook Error: ${err.message}`);
//             }

         

//             switch (event.type) {
//             // 1. Initial Success OR Recurring Success
//             case 'checkout.session.completed':
//             case 'invoice.paid':
//                 const invoice = event.data.object;
//                     await handlePaymentSucceeded("cus_TdNNVATmmzyH7q", next);
//                     // await handlePaymentSucceeded(invoice.customer);
//                     break;
                
//             // 2. Subscription Ended (Manual cancel finished OR Payment failed multiple times)
//             case 'customer.subscription.deleted':
//                 const invoice2 = event.data.object;
                
//                     await handlePaymentFailed("cus_TdNNVATmmzyH7q", next);
                
//                     // await handlePaymentFailed(invoice2.customer);
//                     break;
                

//             // 3. Payment Failed (Optional: Warn the user)
//             case 'invoice.payment_failed':
//             // console.log("Invoice failed");
//             const invoice3 = event.data.object;

//             await handlePaymentFailed("cus_TdNNVATmmzyH7q", next);
//             // await handlePaymentFailed(invoice3.customer);
//             break;
                
//         }
//         res.json({ received: true });
//     }
//     catch(e){
//         return next(new ErrorHandler(e.message, 400));
//     }
// };


const stripeWebHook = async (req, res, next) => { // Removed 'next' here, handle errors locally
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("⚠️ Webhook Signature Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`🔔 Received Stripe Event: ${event.type}`);
    const dataObject = event.data.object;
    // const stripeCustomerId = dataObject.customer;
    const stripeCustomerId = "cus_TdNNVATmmzyH7q";

    try {
        switch (event.type) {
            case 'checkout.session.completed':
            case 'invoice.paid':
                console.log("💰 Processing Success for:", stripeCustomerId);
                // IMPORTANT: Ensure handlePaymentSucceeded ONLY uses the customer ID
                await handlePaymentSucceeded(stripeCustomerId, next); 
                break;

            case 'customer.subscription.deleted':
                console.log("❌ Processing Deletion for:", stripeCustomerId);
                await handlePaymentFailed(stripeCustomerId, next);
                break;

            case 'invoice.payment_failed':
                console.log("⚠️ Processing Failed Payment for:", stripeCustomerId);
                await handlePaymentFailed(stripeCustomerId, next);
                break;
        }

        // Send response ONLY ONCE at the very end
        return res.status(200).json({ received: true });

    } catch (error) {
        console.error("🔥 Logic Error inside Webhook:", error.message);
        // If an error happens here, we send a 500 but only if headers aren't sent
        if (!res.headersSent) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
};





export {
    addServeryData,
    userLogin,
    userDashboard,
    enableMembership,
    stripeWebHook
};