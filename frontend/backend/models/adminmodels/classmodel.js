import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    classId: {
      type: String,
      unique: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      enum: ["A", "B", "C"],
    },

    classTeacher: {
      type: String,
      required: true,
      trim: true,
    },

    roomNumber: {
      type: String,
      trim: true,
    },

    maximumStudents: {
      type: Number,
      min: 1,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

export default Class;
