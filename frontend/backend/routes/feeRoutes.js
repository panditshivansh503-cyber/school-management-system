import express from "express";
import { addFee,getAllFees,getFeesByStudent,getFeeById,updateFee,deleteFee } from "../controllers/feecontroller.js";
import { protect,authorize } from "../middleware/authmiddleware.js";
const router=express.Router(); router.use(protect);
router.get("/",authorize("principal"),getAllFees); router.post("/",authorize("principal"),addFee); router.get("/student/:studentId",authorize("principal","student"),getFeesByStudent); router.get("/:id",authorize("principal"),getFeeById); router.put("/:id",authorize("principal"),updateFee); router.delete("/:id",authorize("principal"),deleteFee);
export default router;
