import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(`${process.env.DB_URI}`, {
    connectTimeoutMS : 30000
}).then(()=>{
    console.log("Database connected successfully.")
}).catch((e)=>{
    console.log("Database connection error message", e.message);
    console.log("Database connection full error", e);
})  