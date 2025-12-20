
import jwt from "jsonwebtoken"
import ErrorHandler from "../utills/ErrorHandler.js"
import adminModel from "../models/adminData.js";
//authenticating admin

const authAdmin = async (req, res, next) =>{
    try{

       const authHeader = req.headers.authorization; 
       
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new ErrorHandler("No token provided or wrong format.", 401));
        }

        // Split the string: ["Bearer", "YOUR_TOKEN"] and take the second part
        const atoken = authHeader.split(' ')[1];
       

       if(!atoken){
        return next(new ErrorHandler("You are not authorize.", 400));
       }
 
       const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        const admin = await adminModel.findOne({_id : token_decode.id}).select({password : 0});
        
       if(!admin){
        return next(new ErrorHandler("You are not authorize.", 400));
       }

       next();
    }
    catch(e){
        // console.error(e);
        return next(new ErrorHandler( e.message, 400))
    }
};

export default authAdmin;