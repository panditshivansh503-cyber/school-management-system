import Student from "../models/adminmodels/addstudentmodel.js";
import Teacher from "../models/adminmodels/addteachermodel.js";
import Class from "../models/adminmodels/classmodel.js";
import User from "../models/login.js";

// ======================================================
// ADD STUDENT
// ======================================================

const addStudent = async (req, res) => {
  try {
    const {
      admissionNo,
      studentName,
      fatherName,
      motherName,
      dob,
      gender,
      className,
      section,
      rollNumber,
      mobile,
      email,
      password,
      totalFee,
      paidFee,
      address,
    } = req.body;

    // Required fields
    if (
      !admissionNo ||
      !studentName ||
      !className ||
      !section ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required student fields",
      });
    }

    // Convert fees to numbers
    const totalFeeNumber = Number(totalFee);
    const paidFeeNumber = Number(paidFee);

    if (isNaN(totalFeeNumber) || isNaN(paidFeeNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid fee amounts",
      });
    }

    if (totalFeeNumber < 0 || paidFeeNumber < 0) {
      return res.status(400).json({
        success: false,
        message: "Fee cannot be negative",
      });
    }

    if (paidFeeNumber > totalFeeNumber) {
      return res.status(400).json({
        success: false,
        message: "Paid fee cannot be greater than total fee",
      });
    }

    // Check email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check admission number
    const existingStudent = await Student.findOne({
      admissionNo,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Admission number already exists",
      });
    }

    // Create student
    const student = await Student.create({
      admissionNo,
      studentName,
      fatherName,
      motherName,
      dob,
      gender,
      className,
      section,
      rollNumber,
      mobile,
      email,
      password,
      totalFee: totalFeeNumber,
      paidFee: paidFeeNumber,
      address,
    });

    // Create login user
    const user = await User.create({
      name: studentName,
      email,
      password,
      role: "student",
      profile: "",
    });

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
      user,
    });
  } catch (error) {
    console.error("Add Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
};

// ======================================================
// ADD TEACHER
// ======================================================

const addTeacher = async (req, res) => {
  try {
    const {
      teacherId,
      teacherName,
      fatherName,
      dob,
      gender,
      subject,
      qualification,
      experience,
      mobile,
      email,
      joiningDate,
      password,
      address,
    } = req.body;

    // Required fields
    if (
      !teacherId ||
      !teacherName ||
      !subject ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required teacher fields",
      });
    }

    // Check email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check teacher ID
    const existingTeacher = await Teacher.findOne({
      teacherId,
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID already exists",
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      teacherId,
      teacherName,
      fatherName,
      dob,
      gender,
      subject,
      qualification,
      experience,
      mobile,
      email,
      joiningDate,
      password,
      address,
    });

    // Create login user
    const user = await User.create({
      name: teacherName,
      email,
      password,
      role: "teacher",
      profile: "",
    });

    return res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      teacher,
      user,
    });
  } catch (error) {
    console.error("Add Teacher Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add teacher",
      error: error.message,
    });
  }
};

// ======================================================
// ADD CLASS
// ======================================================

const addClass = async (req, res) => {
  try {
    const {
      classId,
      className,
      section,
      classTeacher,
      roomNumber,
      maximumStudents,
      academicYear,
      description,
    } = req.body;

    // Required fields
    if (
      !classId ||
      !className ||
      !section ||
      !classTeacher ||
      !academicYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check class ID
    const existingClass = await Class.findOne({
      classId,
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "Class ID already exists",
      });
    }

    // Convert maximum students
    let maximumStudentsNumber;

    if (
      maximumStudents !== undefined &&
      maximumStudents !== null &&
      maximumStudents !== ""
    ) {
      maximumStudentsNumber = Number(maximumStudents);

      if (
        isNaN(maximumStudentsNumber) ||
        maximumStudentsNumber <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid maximum students value",
        });
      }
    }

    // Create class
    const classData = await Class.create({
      classId,
      className,
      section,
      classTeacher,
      roomNumber,
      maximumStudents: maximumStudentsNumber,
      academicYear,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Class added successfully",
      class: classData,
    });
  } catch (error) {
    console.error("Add Class Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add class",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

export {
  addStudent,
  addTeacher,
  addClass,
};