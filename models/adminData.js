import mongoose from "mongoose";

const adminScheme = new mongoose.Schema({
    email : {type : String, required : true, unique: true},
    password : {type : String, default : ""},
}, {minimize : false, timestamps : true});


const adminModel = mongoose.model.admin || mongoose.model("admin", adminScheme);

export default adminModel;