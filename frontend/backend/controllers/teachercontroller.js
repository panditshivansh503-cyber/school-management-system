import Teacher from "../models/adminmodels/addteachermodel.js";
import User from "../models/login.js";

// ======================================================
// GET ALL TEACHERS
// ======================================================

const getAllTeachers = async (req, res) => {
  try {
    const { search, subject } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { teacherName: { $regex: search, $options: "i" } },
        { teacherId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (subject && subject !== "All") {
      filter.subject = subject;
    }

    const teachers = await Teacher.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("Get Teachers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
      error: error.message,
    });
  }
};

// ======================================================
// GET TEACHER BY ID
// ======================================================

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("Get Teacher Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE TEACHER
// ======================================================

const updateTeacher = async (req, res) => {
  try {
    const teacher=await Teacher.findById(req.params.id);
    if(!teacher) return res.status(404).json({success:false,message:"Teacher not found"});
    const oldEmail=teacher.email;
    const allowed=["teacherId","teacherName","fatherName","dob","gender","subject","qualification","experience","mobile","email","joiningDate","password","address"];
    const data=Object.fromEntries(Object.entries(req.body).filter(([key])=>allowed.includes(key)));
    if(data.email) data.email=data.email.trim().toLowerCase();
    if(data.email && data.email!==oldEmail && await User.exists({email:data.email})) return res.status(400).json({success:false,message:"Email already exists"});
    Object.assign(teacher,data); await teacher.save();
    const loginUpdate={}; if(data.teacherName) loginUpdate.name=data.teacherName; if(data.email) loginUpdate.email=data.email; if(data.password) loginUpdate.password=data.password;
    if(Object.keys(loginUpdate).length) await User.findOneAndUpdate({email:oldEmail},loginUpdate,{runValidators:true});
    res.status(200).json({success:true,message:"Teacher updated successfully",teacher});
  } catch(error) { console.error("Update Teacher Error:",error); res.status(400).json({success:false,message:"Failed to update teacher",error:error.message}); }
};

// ======================================================
// DELETE TEACHER
// ======================================================

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await Teacher.findByIdAndDelete(req.params.id);

    // Delete login user
    await User.findOneAndDelete({ email: teacher.email });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Delete Teacher Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete teacher",
      error: error.message,
    });
  }
};

// ======================================================
// GET TEACHER BY EMAIL (for profile)
// ======================================================

const getTeacherByEmail = async (req, res) => {
  try {
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
      teacher,
    });
  } catch (error) {
    console.error("Get Teacher By Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher",
      error: error.message,
    });
  }
};

export {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherByEmail,
};
