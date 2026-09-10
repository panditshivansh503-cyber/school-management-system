import jwt from "jsonwebtoken";
import User from "../models/login.js";

const getSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return process.env.JWT_SECRET;
};

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).json({ success:false, message:"Authentication required" });
  const token = header.slice(7).trim();
  if (!token) return res.status(401).json({ success:false, message:"Authentication required" });
  try {
    const decoded = jwt.verify(token, getSecret());
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success:false, message:"User account no longer exists" });
    req.user = { id:user._id, name:user.name, email:user.email, role:user.role };
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ success:false, message:"Token is invalid or has expired" });
  }
};

export const authorize = (...roles) => (req,res,next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success:false, message:"You are not authorized to access this resource" });
  next();
};

export const generateToken = (payload) => jwt.sign(payload, getSecret(), { expiresIn:"30d" });
