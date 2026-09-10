import Student from "../models/adminmodels/addstudentmodel.js";
import User from "../models/login.js";
import Teacher from "../models/adminmodels/addteachermodel.js";

// ======================================================
// GET ALL STUDENTS
// ======================================================

const getAllStudents = async (req, res) => {
  try {
    const { className, section, search } = req.query;

    let filter = {};

    if (req.user?.role === "teacher") {
      const teacher = await Teacher.findOne({ email: req.user.email }).select("teacherName");
      if (!teacher) return res.status(403).json({ success:false, message:"Teacher profile not found" });
      const classes = await (await import("../models/adminmodels/classmodel.js")).default.find({ classTeacher: teacher.teacherName }).distinct("className");
      filter.className = { $in: classes };
    }

    if (className && className !== "All") {
      filter.className = className;
    }

    if (section && section !== "All") {
      filter.section = section;
    }

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { admissionNo: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ======================================================
// GET STUDENT BY ID
// ======================================================

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE STUDENT
// ======================================================

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success:false, message:"Student not found" });
    const oldEmail=student.email;
    const allowed=["admissionNo","studentName","fatherName","motherName","dob","gender","className","section","rollNumber","mobile","email","password","totalFee","paidFee","address"];
    const data=Object.fromEntries(Object.entries(req.body).filter(([key])=>allowed.includes(key)));
    if(data.email) data.email=data.email.trim().toLowerCase();
    if(data.totalFee !== undefined && data.paidFee === undefined) data.paidFee=student.paidFee;
    if(data.paidFee !== undefined && data.totalFee === undefined) data.totalFee=student.totalFee;
    if(data.email && data.email!==oldEmail && await User.exists({email:data.email})) return res.status(400).json({success:false,message:"Email already exists"});
    Object.assign(student,data);
    await student.save();
    const loginUpdate={};
    if(data.studentName) loginUpdate.name=data.studentName;
    if(data.email) loginUpdate.email=data.email;
    if(data.password) loginUpdate.password=data.password;
    if(Object.keys(loginUpdate).length) await User.findOneAndUpdate({email:oldEmail},loginUpdate,{runValidators:true});
    res.status(200).json({success:true,message:"Student updated successfully",student});
  } catch(error) {
    console.error("Update Student Error:",error);
    res.status(400).json({success:false,message:"Failed to update student",error:error.message});
  }
};

// ======================================================
// DELETE STUDENT
// ======================================================

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete student
    await Student.findByIdAndDelete(req.params.id);

    // Delete login user
    await User.findOneAndDelete({ email: student.email });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

// ======================================================
// GET STUDENT BY EMAIL (for profile)
// ======================================================

const getStudentByEmail = async (req, res) => {
  try {
    if (req.user?.role === "student" && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) return res.status(403).json({success:false,message:"You can only access your own profile"});
    const student = await Student.findOne({
      email: req.params.email,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get Student By Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

export {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentByEmail,
};
