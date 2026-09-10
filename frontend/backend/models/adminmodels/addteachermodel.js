import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const TeacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      unique: true,
      trim: true,
    },

    teacherName: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      trim: true,
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    joiningDate: {
      type: Date,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TeacherSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);

export default Teacher;