import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import loginRoutes from "./routes/loginRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import errorMiddleware from "./middleware/errormiddleware.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigin.split(",").map((v)=>v.trim()), credentials:true }));
app.use(express.json({ limit:"1mb" }));
app.use(express.urlencoded({ extended:true, limit:"1mb" }));

app.get("/", (req,res)=>res.json({ success:true, message:"School Management Backend API is running", version:"3.0.0" }));
app.get("/api/health", (req,res)=>res.json({ success:true, status:"ok", timestamp:new Date().toISOString() }));

app.use("/api/auth", loginRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req,res)=>res.status(404).json({ success:false, message:"API route not found" }));
app.use(errorMiddleware);

const startServer = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  await connectDB();
  app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
};

if (process.env.NODE_ENV !== "test") {
  startServer().catch((error)=>{ console.error("Server startup failed:",error.message); process.exit(1); });
}
export default app;
