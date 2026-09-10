import Student from "../models/adminmodels/addstudentmodel.js";
import Teacher from "../models/adminmodels/addteachermodel.js";
import User from "../models/login.js";

// ======================================================
// GET TEACHER PROFILE
// ======================================================

const getTeacherProfile = async (req, res) => {
  try {
    if (req.user?.role === "teacher" && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) return res.status(403).json({success:false,message:"You can only access your own profile"});
    const teacher = await Teacher.findOne({
      email: req.params.email,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      profile: teacher,
    });
  } catch (error) {
    console.error("Get Teacher Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher profile",
      error: error.message,
    });
  }
};

// ======================================================
// GET STUDENT PROFILE
// ======================================================

const getStudentProfile = async (req, res) => {
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
      profile: student,
    });
  } catch (error) {
    console.error("Get Student Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student profile",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE TEACHER PROFILE
// ======================================================

const updateTeacherProfile = async (req, res) => {
  try {
    if (req.user?.role === "teacher" && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) return res.status(403).json({success:false,message:"You can only update your own profile"});
    const teacher = await Teacher.findOne({
      email: req.params.email,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Don't allow password change via profile
    const { password, ...updateData } = req.body;

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { email: req.params.email },
      updateData,
      { new: true, runValidators: true }
    );

    // Update login user name/email if changed
    const loginUpdate = {};

    if (updateData.teacherName) {
      loginUpdate.name = updateData.teacherName;
    }

    if (
      updateData.email &&
      updateData.email !== req.params.email
    ) {
      loginUpdate.email = updateData.email;
    }

    if (Object.keys(loginUpdate).length > 0) {
      await User.findOneAndUpdate(
        { email: req.params.email },
        loginUpdate
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedTeacher,
    });
  } catch (error) {
    console.error("Update Teacher Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE STUDENT PROFILE
// ======================================================

const updateStudentProfile = async (req, res) => {
  try {
    if (req.user?.role === "student" && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) return res.status(403).json({success:false,message:"You can only update your own profile"});
    const student = await Student.findOne({
      email: req.params.email,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Don't allow password/fee changes via profile
    const { password, totalFee, paidFee, ...updateData } =
      req.body;

    const updatedStudent = await Student.findOneAndUpdate(
      { email: req.params.email },
      updateData,
      { new: true, runValidators: true }
    );

    // Update login user
    const loginUpdate = {};

    if (updateData.studentName) {
      loginUpdate.name = updateData.studentName;
    }

    if (
      updateData.email &&
      updateData.email !== req.params.email
    ) {
      loginUpdate.email = updateData.email;
    }

    if (Object.keys(loginUpdate).length > 0) {
      await User.findOneAndUpdate(
        { email: req.params.email },
        loginUpdate
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedStudent,
    });
  } catch (error) {
    console.error("Update Student Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export {
  getTeacherProfile,
  getStudentProfile,
  updateTeacherProfile,
  updateStudentProfile,
};
