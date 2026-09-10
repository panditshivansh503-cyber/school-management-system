import express from "express";
import { getAllTeachers,getTeacherById,updateTeacher,deleteTeacher,getTeacherByEmail } from "../controllers/teachercontroller.js";
import { addTeacher } from "../controllers/admincontroller.js";
import { protect, authorize } from "../middleware/authmiddleware.js";
const router=express.Router(); router.use(protect);
router.get("/",authorize("principal"),getAllTeachers); router.post("/",authorize("principal"),addTeacher); router.get("/email/:email",authorize("principal","teacher"),getTeacherByEmail); router.get("/:id",authorize("principal"),getTeacherById); router.put("/:id",authorize("principal"),updateTeacher); router.delete("/:id",authorize("principal"),deleteTeacher);
export default router;
