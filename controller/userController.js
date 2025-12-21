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
            grow,
            country
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


        const userData = {
            name,
            email,
            seeking,
            password : hashedPassword,
            areaOfInterest,
            languagePreferance,
            grow,
            country

        };

        const newUser = new userModel(userData);
        await newUser.save();

        
        const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET);
        res.status(200).json({status : "success", message : "Form Submitted Successfully.", data:{token}});
    }
    catch(e){
        if(e.code ===  11000){
           res.status(400).json({stauts : "fail", message:  "This email already exists."})
        }
        res.status(400).json({stauts : "fail", message:  e.message})
        
    }
};


// User Login
const userLogin = async(req, res,next) =>{

    try{
        const{
            email,
            password
        } = req.body;


        const user = await userModel.findOne({email});

        if(!user){
            res.status(400).json({status : "fail", message : "Account does not exist."})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({id : user._id, email : user.email}, process.env.JWT_SECRET);
            res.status(200).json({status : "success", message : "Login Successfully." ,token})
        }
        else{
             res.status(400).json({status : "fail", message : "Wrong Email or Password."})
        }

    }
    catch(e){
         res.status(400).json({status : "fail", message : e.message});
    }
};


// Admin Dashboard Login
const userDashboard = async(req, res,next) =>{

    try{
        const utoken = req.utoken;
        const user = req.user;

        if(user.userType !== "premium"){
            res.status(400).json({status: "fail", message : "Not a premium user" });
        }

        res.status(200).json({status : "success", message : "Premium User", data : {username : user.name}});
    }
    catch(e){
        return next(new ErrorHandler(e.message, 400));
    }
};




async function enableMembership(req, res) {
    try {

        // Fetch professional data
        // const {utoken} = req.headers;

        const utoken = req.utoken;

        console.log(utoken);
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
            success_url: `${process.env.CLIENT_URI}/thankyou`,
            cancel_url: `${process.env.CLIENT_URI}/`,
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
    
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

 
    const dataObject = event.data.object;
    const stripeCustomerId = dataObject.customer;
    // const stripeCustomerId = "cus_TdNNVATmmzyH7q";

    try {
        switch (event.type) {
            case 'checkout.session.completed':
            case 'invoice.paid':
             
                // IMPORTANT: Ensure handlePaymentSucceeded ONLY uses the customer ID
                await handlePaymentSucceeded(stripeCustomerId, next); 
                break;

            case 'customer.subscription.deleted':
              
                await handlePaymentFailed(stripeCustomerId, next);
                break;

            case 'invoice.payment_failed':
            
                await handlePaymentFailed(stripeCustomerId, next);
                break;
        }

        // Send response ONLY ONCE at the very end
        return res.status(200).json({ received: true });

    } catch (error) {
       
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