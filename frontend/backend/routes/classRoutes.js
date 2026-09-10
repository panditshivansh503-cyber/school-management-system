import express from "express";
import { getAllClasses,getClassById,updateClass,deleteClass } from "../controllers/classcontroller.js";
import { addClass } from "../controllers/admincontroller.js";
import { protect,authorize } from "../middleware/authmiddleware.js";
const router=express.Router(); router.use(protect);
router.get("/",authorize("principal","teacher"),getAllClasses); router.post("/",authorize("principal"),addClass); router.get("/:id",authorize("principal","teacher"),getClassById); router.put("/:id",authorize("principal"),updateClass); router.delete("/:id",authorize("principal"),deleteClass);
export default router;
