import express from "express";


const router = express.Router();

// ===============================
// ADD NEW CLASS
// ===============================
router.post("/add-class", async (req, res) => {
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
    if (!className || !section || !classTeacher || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check duplicate Class ID
    if (classId) {
      const existingClass = await Class.findOne({ classId });

      if (existingClass) {
        return res.status(400).json({
          success: false,
          message: "Class ID already exists",
        });
      }
    }

    // Create class
    const newClass = new Class({
      classId,
      className,
      section,
      classTeacher,
      roomNumber,
      maximumStudents,
      academicYear,
      description,
    });

    // Save to MongoDB
    const savedClass = await newClass.save();

    res.status(201).json({
      success: true,
      message: "Class added successfully",
      class: savedClass,
    });
  } catch (error) {
    console.error("Add Class Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while adding class",
      error: error.message,
    });
  }
});


// ===============================
// GET ALL CLASSES
// ===============================
router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error("Get Classes Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching classes",
      error: error.message,
    });
  }
});


// ===============================
// GET SINGLE CLASS
// ===============================
router.get("/classes/:id", async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      class: classData,
    });
  } catch (error) {
    console.error("Get Class Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


// ===============================
// DELETE CLASS
// ===============================
router.delete("/classes/:id", async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Delete Class Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting class",
      error: error.message,
    });
  }
});


// ===============================
// UPDATE CLASS
// ===============================
router.put("/classes/:id", async (req, res) => {
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

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        classId,
        className,
        section,
        classTeacher,
        roomNumber,
        maximumStudents,
        academicYear,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Update Class Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating class",
      error: error.message,
    });
  }
});

export default router;
