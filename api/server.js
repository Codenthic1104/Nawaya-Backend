import express from "express"
import cors from "cors"
import "dotenv/config"


import userRouter from "../routes/userRoute.js"
import adminRouter from "../routes/adminRoute.js"


// Database models 
import userModel from "../models/userData.js"
import { stripeWebHook } from "../controller/userController.js"


//Setting up server and port
const app = express();
const port = process.env.PORT || 2000;

//connect mongodb database
import("../config/mogodb.js")


//Stripe web hook

app.post("/api/user/webhook/stripe",express.raw({ type: 'application/json' }), stripeWebHook);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




//api endpoint

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);




app.get("/", (req, res)=>{
    res.status(200).json({message: "Server connected successfully."})
})


app.listen(port, ()=>{
    console.log(`Server is active at port ${port}`)
})
