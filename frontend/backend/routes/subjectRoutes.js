import express from "express";
import { addSubject,getAllSubjects,getSubjectById,updateSubject,deleteSubject } from "../controllers/subjectcontroller.js";
import { protect,authorize } from "../middleware/authmiddleware.js";
const router=express.Router(); router.use(protect);
router.get("/",authorize("principal","teacher","student"),getAllSubjects); router.post("/",authorize("principal"),addSubject); router.get("/:id",authorize("principal","teacher","student"),getSubjectById); router.put("/:id",authorize("principal"),updateSubject); router.delete("/:id",authorize("principal"),deleteSubject);
export default router;
