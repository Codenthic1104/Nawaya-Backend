
import jwt from "jsonwebtoken"
import ErrorHandler from "../utills/ErrorHandler.js"
import adminModel from "../models/adminData.js";
import userModel from "../models/userData.js";
//authenticating admin

const authUser = async (req, res, next) =>{
    try{
    //    const {utoken} = req.headers;
    const authHeader = req.headers.authorization; 
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new ErrorHandler("No token provided or wrong format.", 401));
        }

        // Split the string: ["Bearer", "YOUR_TOKEN"] and take the second part
        const utoken = authHeader.split(' ')[1];

        console.log("TOKEN ",utoken);

       if(!utoken){
        return next(new ErrorHandler("You are not authorize.", 400));
       }

       const token_decode = jwt.verify(utoken, process.env.JWT_SECRET);
       const user = await userModel.findOne({_id : token_decode.id}).select({password : 0});
        

       if(!user){
        return next(new ErrorHandler("You are not authorize.", 400));
       }
       req.utoken = utoken;
       req.user = user;
       next();
    }
    catch(e){
        // console.error(e);
        return next(new ErrorHandler( e.message, 400))
    }
};

export default authUser;