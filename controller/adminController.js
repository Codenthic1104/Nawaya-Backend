import ErrorHandler from "../utills/ErrorHandler.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Stripe from "stripe"
import moment from "moment"

// User database model 
import adminModel from "../models/adminData.js";
import userModel from "../models/userData.js";

//Stripe credential setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




// Admin Login
const adminLogin = async(req, res,next) =>{

    try{
        const{
            email,
            password
        } = req.body;


        const admin = await adminModel.findOne({email});


        if(!admin){
            return next(new ErrorHandler( "Admin account doesn't exist.", 400))
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log(isMatch)
        if(isMatch){
            const token = jwt.sign({id : admin._id}, process.env.JWT_SECRET);
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
const adminDashboard = async(req, res,next) =>{

    try{
        const userData = await userModel.find({}).select({password : 0});
        // const totalPaid = userData.filter((data)=>(data.userType == "premium")).length;
       
        res.status(200).json({status : "success", message: "Data fetched successfully", data: {userData}});
    }
    catch(e){
        return next(new ErrorHandler(e.message, 400));
    }
};



export {
    adminLogin,
    adminDashboard
};