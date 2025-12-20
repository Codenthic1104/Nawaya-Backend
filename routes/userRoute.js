import express from "express"

// Database models 
import userModel from "../models/userData.js"
import { addServeryData, enableMembership, stripeWebHook, userDashboard, userLogin } from "../controller/userController.js";
import authUser from "../middleware/authUser.js";



const userRouter = express.Router();

userRouter.post("/addSurveyData", addServeryData);
userRouter.post("/login", userLogin);
userRouter.get("/userDashboard", authUser ,userDashboard);
userRouter.post("/enableMembership", authUser ,enableMembership);
// userRouter.post("/webhook/stripe",express.raw({ type: 'application/json' }), stripeWebHook);



export default userRouter;
