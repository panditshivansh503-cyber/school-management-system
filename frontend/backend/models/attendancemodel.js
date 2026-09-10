import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    studentName: {
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
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent"],
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    subject: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One student can have one attendance record per date per subject
AttendanceSchema.index(
  { student: 1, date: 1, subject: 1 },
  { unique: true }
);

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
