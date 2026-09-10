import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const StudentSchema = new mongoose.Schema(
  {
    admissionNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    motherName: {
      type: String,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      enum: ["A", "B", "C"],
      required: true,
    },

    rollNumber: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // ===============================
    // FEE INFORMATION
    // ===============================

    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    paidFee: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalFee;
        },
        message: "Paid fee cannot be greater than total fee",
      },
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

StudentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;