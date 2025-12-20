import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    name: {type: String, required : true},
    email : {type : String, required : true, unique: true},
    password : {type : String, default : ""},
    userType : {type : String, default : "waitlist"},  //waitlist/premium
    seeking : {type : String, default : ""},
    areaOfInterest : {type : Array , default : []},
    languagePreferance : {type : Array , default : []},
    grow : {type : Array , default : []},
    stripeCustomerId :{
        type : String,
        default : ""
    },
    lastPaymentDate : {type : Date, default : ""},
}, {minimize : false, timestamps : true});


const userModel = mongoose.model.user || mongoose.model("user", userScheme);

export default userModel;