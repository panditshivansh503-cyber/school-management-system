import express from "express";
import { getTeacherProfile,getStudentProfile,updateTeacherProfile,updateStudentProfile } from "../controllers/profilecontroller.js";
import { protect,authorize } from "../middleware/authmiddleware.js";
const router=express.Router(); router.use(protect);
router.get("/teacher/:email",authorize("teacher","principal"),getTeacherProfile); router.put("/teacher/:email",authorize("teacher"),updateTeacherProfile); router.get("/student/:email",authorize("student","principal"),getStudentProfile); router.put("/student/:email",authorize("student"),updateStudentProfile);
export default router;
