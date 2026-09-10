import Subject from "../models/adminmodels/subjectmodel.js";

// ======================================================
// ADD SUBJECT
// ======================================================

const addSubject = async (req, res) => {
  try {
    const {
      subjectId,
      subjectName,
      className,
      section,
      teacher,
      subjectCode,
      description,
    } = req.body;

    // Required fields
    if (!subjectName || !className || !section || !teacher) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check duplicate subject ID
    if (subjectId) {
      const existingSubject = await Subject.findOne({
        subjectId,
      });

      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: "Subject ID already exists",
        });
      }
    }

    const subject = await Subject.create({
      subjectId,
      subjectName,
      className,
      section,
      teacher,
      subjectCode,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Subject added successfully",
      subject,
    });
  } catch (error) {
    console.error("Add Subject Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add subject",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL SUBJECTS
// ======================================================

const getAllSubjects = async (req, res) => {
  try {
    const { search, className } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { subjectName: { $regex: search, $options: "i" } },
        { subjectId: { $regex: search, $options: "i" } },
        { teacher: { $regex: search, $options: "i" } },
      ];
    }

    if (className && className !== "All") {
      filter.className = className;
    }

    const subjects = await Subject.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    console.error("Get Subjects Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};

// ======================================================
// GET SUBJECT BY ID
// ======================================================

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    console.error("Get Subject Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subject",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE SUBJECT
// ======================================================

const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    console.error("Update Subject Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE SUBJECT
// ======================================================

const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Delete Subject Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete subject",
      error: error.message,
    });
  }
};

export {
  addSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
