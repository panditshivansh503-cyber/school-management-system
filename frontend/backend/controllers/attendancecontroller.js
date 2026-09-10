import Attendance from "../models/attendancemodel.js";
import Student from "../models/adminmodels/addstudentmodel.js";
import Teacher from "../models/adminmodels/addteachermodel.js";

// ======================================================
// MARK ATTENDANCE (Bulk)
// ======================================================

const markAttendance = async (req, res) => {
  try {
    const { date, className, section, attendance } = req.body;
    if (!date || Number.isNaN(new Date(date).getTime()) || !className || !section || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ success:false, message:"Please provide a valid date, class, section and attendance data" });
    }

    const teacher = await Teacher.findOne({ email:req.user.email }).select("_id teacherName");
    if (!teacher) return res.status(403).json({ success:false, message:"Teacher profile not found" });

    const validStatuses = new Set(["Present","Absent"]);
    const studentIds = attendance.map((r)=>r.studentId);
    const students = await Student.find({ _id:{ $in:studentIds }, className, section }).select("_id studentName");
    const studentMap = new Map(students.map((s)=>[String(s._id),s]));
    if (students.length !== attendance.length) return res.status(400).json({ success:false, message:"Attendance contains students outside the selected class or section" });

    const results=[];
    const dayStart=new Date(date); dayStart.setHours(0,0,0,0);
    for (const record of attendance) {
      if (!validStatuses.has(record.status)) return res.status(400).json({success:false,message:"Invalid attendance status"});
      const student=studentMap.get(String(record.studentId));
      const attendanceRecord=await Attendance.findOneAndUpdate(
        { student:student._id, date:dayStart, className, section, subject:record.subject || "" },
        { student:student._id, studentName:student.studentName, className, section, date:dayStart, status:record.status, markedBy:teacher._id, subject:record.subject || "" },
        { upsert:true, new:true, runValidators:true, setDefaultsOnInsert:true }
      );
      results.push(attendanceRecord);
    }
    res.status(201).json({success:true,message:"Attendance marked successfully",count:results.length,attendance:results});
  } catch(error) {
    console.error("Mark Attendance Error:",error);
    res.status(500).json({success:false,message:"Failed to mark attendance",error:error.message});
  }
};

// ======================================================
// GET ATTENDANCE BY STUDENT
// ======================================================

const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    let filter = { student: studentId };

    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const attendance = await Attendance.find(filter).sort({
      date: -1,
    });

    // Calculate stats
    const totalDays = attendance.length;

    const presentDays = attendance.filter(
      (a) => a.status === "Present"
    ).length;

    const absentDays = attendance.filter(
      (a) => a.status === "Absent"
    ).length;

    const percentage =
      totalDays > 0
        ? Math.round((presentDays / totalDays) * 100)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalDays,
        presentDays,
        absentDays,
        percentage,
      },
      attendance,
    });
  } catch (error) {
    console.error("Get Student Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// ======================================================
// GET ATTENDANCE BY CLASS
// ======================================================

const getAttendanceByClass = async (req, res) => {
  try {
    const { className, section } = req.params;
    const { date } = req.query;

    let filter = { className };

    if (section && section !== "all") {
      filter.section = section;
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      filter.date = {
        $gte: targetDate,
        $lt: nextDate,
      };
    }

    const attendance = await Attendance.find(filter).sort({
      studentName: 1,
    });

    // Stats
    const total = attendance.length;

    const present = attendance.filter(
      (a) => a.status === "Present"
    ).length;

    const absent = attendance.filter(
      (a) => a.status === "Absent"
    ).length;

    const percentage =
      total > 0
        ? Math.round((present / total) * 100)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        present,
        absent,
        percentage,
      },
      attendance,
    });
  } catch (error) {
    console.error("Get Class Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch class attendance",
      error: error.message,
    });
  }
};

// ======================================================
// GET STUDENTS FOR ATTENDANCE (by class)
// ======================================================

const getStudentsForAttendance = async (req, res) => {
  try {
    const { className, section } = req.query;

    let filter = {};

    if (className) {
      filter.className = className;
    }

    if (section && section !== "all") {
      filter.section = section;
    }

    const students = await Student.find(filter)
      .select(
        "_id admissionNo studentName className section rollNumber"
      )
      .sort({ rollNumber: 1, studentName: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get Students For Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

export {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByClass,
  getStudentsForAttendance,
};
