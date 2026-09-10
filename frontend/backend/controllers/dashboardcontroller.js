import Student from "../models/adminmodels/addstudentmodel.js";
import Teacher from "../models/adminmodels/addteachermodel.js";
import Class from "../models/adminmodels/classmodel.js";
import Fee from "../models/adminmodels/feemodel.js";
import Attendance from "../models/attendancemodel.js";

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getAdminDashboard = async (req, res) => {
  try {
    // Counts
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalClasses = await Class.countDocuments();

    // Total fees
    const feesAgg = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalFees: { $sum: "$totalFee" },
          totalPaid: { $sum: "$paidFee" },
        },
      },
    ]);

    const totalFees =
      feesAgg.length > 0 ? feesAgg[0].totalFees : 0;

    const totalPaid =
      feesAgg.length > 0 ? feesAgg[0].totalPaid : 0;

    // Recent students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("studentName className section createdAt");

    // Today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    });

    const presentToday = todayAttendance.filter(
      (a) => a.status === "Present"
    ).length;

    const absentToday = todayAttendance.filter(
      (a) => a.status === "Absent"
    ).length;

    const attendancePercentage =
      todayAttendance.length > 0
        ? Math.round(
            (presentToday / todayAttendance.length) * 100
          )
        : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalFees,
        totalPaid,
        totalDue: totalFees - totalPaid,
        recentStudents,
        attendance: {
          present: presentToday,
          absent: absentToday,
          percentage: attendancePercentage,
        },
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

// ======================================================
// TEACHER DASHBOARD
// ======================================================

const getTeacherDashboard = async (req, res) => {
  try {
    if (req.user?.role === "teacher" && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) return res.status(403).json({success:false,message:"You can only access your own dashboard"});
    const { email } = req.params;

    // Get teacher info
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Get students in teacher's classes
    const myStudents = await Student.countDocuments({
      className: {
        $in: await Class.find({
          classTeacher: teacher.teacherName,
        }).distinct("className"),
      },
    });

    // Get classes assigned to teacher
    const myClasses = await Class.find({
      classTeacher: teacher.teacherName,
    });

    // Today's attendance for teacher's classes
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const classNames = myClasses.map((c) => c.className);

    const todayAttendance = await Attendance.find({
      className: { $in: classNames },
      date: { $gte: today, $lt: tomorrow },
    });

    const present = todayAttendance.filter(
      (a) => a.status === "Present"
    ).length;

    const absent = todayAttendance.filter(
      (a) => a.status === "Absent"
    ).length;

    const percentage =
      todayAttendance.length > 0
        ? Math.round(
            (present / todayAttendance.length) * 100
          )
        : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        teacher: {
          name: teacher.teacherName,
          subject: teacher.subject,
          teacherId: teacher.teacherId,
        },
        myStudents,
        myClasses: myClasses.length,
        classesToday: myClasses.length,
        attendance: {
          present,
          absent,
          percentage,
        },
      },
    });
  } catch (error) {
    console.error("Teacher Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher dashboard",
      error: error.message,
    });
  }
};

// ======================================================
// STUDENT DASHBOARD
// ======================================================

const getStudentDashboard = async (req, res) => {
  try {
    if (req.user?.role === "student" && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) return res.status(403).json({success:false,message:"You can only access your own dashboard"});
    const { email } = req.params;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Attendance stats
    const attendance = await Attendance.find({
      student: student._id,
    });

    const totalDays = attendance.length;

    const presentDays = attendance.filter(
      (a) => a.status === "Present"
    ).length;

    const absentDays = attendance.filter(
      (a) => a.status === "Absent"
    ).length;

    const attendancePercentage =
      totalDays > 0
        ? Math.round((presentDays / totalDays) * 100)
        : 0;

    // Subjects count
    const subjects = await (
      await import("../models/adminmodels/subjectmodel.js")
    ).default.countDocuments({
      className: student.className,
      section: student.section,
    });

    // Fee info
    const remainingFee = student.totalFee - student.paidFee;

    res.status(200).json({
      success: true,
      dashboard: {
        student: {
          name: student.studentName,
          className: student.className,
          section: student.section,
          rollNumber: student.rollNumber,
          admissionNo: student.admissionNo,
        },
        attendance: {
          totalDays,
          presentDays,
          absentDays,
          percentage: attendancePercentage,
        },
        subjects,
        fees: {
          totalFee: student.totalFee,
          paidFee: student.paidFee,
          remainingFee,
        },
      },
    });
  } catch (error) {
    console.error("Student Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student dashboard",
      error: error.message,
    });
  }
};

export {
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard,
};
