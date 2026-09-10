import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const loginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["principal", "teacher", "student"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profile: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save if modified
loginSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method (handles bcrypt hashes and plain text fallback)
loginSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password.startsWith("$2a$") && !this.password.startsWith("$2b$") && !this.password.startsWith("$2y$")) {
    return this.password === enteredPassword;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if model already compiled, otherwise compile
const Login = mongoose.models.user || mongoose.model("user", loginSchema);

export default Login;