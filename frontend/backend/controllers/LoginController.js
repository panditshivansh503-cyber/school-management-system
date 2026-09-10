import Login from "../models/login.js";
import { generateToken } from "../middleware/authmiddleware.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await Login.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile || "",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await Login.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Seed an initial principal / admin user if none exists
export const seedAdmin = async (req, res) => {
  try {
    if (process.env.ALLOW_ADMIN_SEED !== "true") {
      return res.status(403).json({ success:false, message:"Admin seeding is disabled" });
    }
    const { name, email, password } = req.body;
    const existing = await Login.findOne({ email: email?.toLowerCase() || "admin@school.com" });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Admin account already exists",
      });
    }

    const admin = await Login.create({
      name: name || "Principal Admin",
      email: (email || "admin@school.com").toLowerCase(),
      password: password || "Admin@123",
      role: "principal",
    });

    const token = generateToken({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default loginUser;