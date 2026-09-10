import express from "express";
import { markAttendance,getAttendanceByStudent,getAttendanceByClass,getStudentsForAttendance } from "../controllers/attendancecontroller.js";
import { protect,authorize } from "../middleware/authmiddleware.js";
const router=express.Router(); router.use(protect);
router.post("/",authorize("teacher"),markAttendance); router.get("/students",authorize("teacher"),getStudentsForAttendance); router.get("/class/:className/:section",authorize("principal","teacher"),getAttendanceByClass); router.get("/student/:studentId",authorize("principal","student"),getAttendanceByStudent);
export default router;
