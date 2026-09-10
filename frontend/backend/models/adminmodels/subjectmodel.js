import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      unique: true,
      trim: true,
    },

    subjectName: {
      type: String,
      required: true,
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

    teacher: {
      type: String,
      required: true,
      trim: true,
    },

    subjectCode: {
      type: String,
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

const Subject = mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);

export default Subject;
