import Class from "../models/adminmodels/classmodel.js";

// ======================================================
// GET ALL CLASSES
// ======================================================

const getAllClasses = async (req, res) => {
  try {
    const { className } = req.query;

    let filter = {};

    if (className && className !== "All") {
      filter.className = className;
    }

    const classes = await Class.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    console.error("Get Classes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: error.message,
    });
  }
};

// ======================================================
// GET CLASS BY ID
// ======================================================

const getClassById = async (req, res) => {
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
      message: "Failed to fetch class",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE CLASS
// ======================================================

const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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
      message: "Failed to update class",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE CLASS
// ======================================================

const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(
      req.params.id
    );

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
      message: "Failed to delete class",
      error: error.message,
    });
  }
};

export {
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};
