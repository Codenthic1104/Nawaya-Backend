import express from "express"

// Database models 
import authAdmin from "../middleware/authAdmin.js";
import { adminDashboard, adminLogin } from "../controller/adminController.js";



const admin = express.Router();

// admin.post("/addSurveyData", addServeryData);
admin.post("/login", adminLogin);
admin.get("/dashboard", authAdmin ,adminDashboard);



export default admin;
