import express from "express";
import { getAdminDashboard,getTeacherDashboard,getStudentDashboard } from "../controllers/dashboardcontroller.js";
import { protect,authorize } from "../middleware/authmiddleware.js";
const router=express.Router(); router.use(protect);
router.get("/admin",authorize("principal"),getAdminDashboard); router.get("/teacher/:email",authorize("teacher"),getTeacherDashboard); router.get("/student/:email",authorize("student"),getStudentDashboard);
export default router;
