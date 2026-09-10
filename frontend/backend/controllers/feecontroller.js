import Fee from "../models/adminmodels/feemodel.js";
import Student from "../models/adminmodels/addstudentmodel.js";

// ======================================================
// ADD FEE
// ======================================================

const addFee = async (req, res) => {
  try {
    const {
      feeId,
      student,
      studentName,
      className,
      section,
      feeType,
      totalFee,
      paidAmount,
      paymentDate,
      paymentMode,
      status,
      receiptNo,
      remarks,
    } = req.body;

    // Required fields
    if (
      !studentName ||
      !className ||
      !feeType ||
      !totalFee ||
      !paymentDate ||
      !paymentMode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check duplicate fee ID
    if (feeId) {
      const existingFee = await Fee.findOne({ feeId });

      if (existingFee) {
        return res.status(400).json({
          success: false,
          message: "Fee ID already exists",
        });
      }
    }

    const total=Number(totalFee); const paid=Number(paidAmount || 0);
    if (!Number.isFinite(total) || total < 0 || !Number.isFinite(paid) || paid < 0 || paid > total) return res.status(400).json({success:false,message:"Please enter valid fee amounts"});

    // Find student if name provided but no ObjectId
    let studentId = student;

    if (!studentId && studentName) {
      const studentDoc = await Student.findOne({
        studentName: {
          $regex: new RegExp(`^${studentName}$`, "i"),
        },
      });

      if (studentDoc) {
        studentId = studentDoc._id;
      }
    }

    if (!studentId) return res.status(400).json({success:false,message:"A valid student is required"});

    const fee = new Fee({
      feeId,
      student: studentId,
      studentName,
      className,
      section,
      feeType,
      totalFee: total,
      paidAmount: paid,
      paymentDate,
      paymentMode,
      status,
      receiptNo,
      remarks,
    });

    await fee.save();

    res.status(201).json({
      success: true,
      message: "Fee added successfully",
      fee,
    });
  } catch (error) {
    console.error("Add Fee Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add fee",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL FEES
// ======================================================

const getAllFees = async (req, res) => {
  try {
    const { search, className, status } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { feeId: { $regex: search, $options: "i" } },
      ];
    }

    if (className && className !== "All") {
      filter.className = { $regex: className, $options: "i" };
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    const fees = await Fee.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    console.error("Get Fees Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fees",
      error: error.message,
    });
  }
};

// ======================================================
// GET FEES BY STUDENT
// ======================================================

const getFeesByStudent = async (req, res) => {
  try {
    if (req.user?.role === "student") {
      const ownStudent = await Student.findOne({ email:req.user.email }).select("_id");
      if (!ownStudent || String(ownStudent._id) !== String(req.params.studentId)) return res.status(403).json({success:false,message:"You can only access your own fee records"});
    }
    const fees = await Fee.find({
      student: req.params.studentId,
    }).sort({ createdAt: -1 });

    // Calculate totals
    const totalFees = fees.reduce(
      (sum, fee) => sum + fee.totalFee,
      0
    );

    const totalPaid = fees.reduce(
      (sum, fee) => sum + fee.paidAmount,
      0
    );

    const totalDue = totalFees - totalPaid;

    res.status(200).json({
      success: true,
      count: fees.length,
      summary: {
        totalFees,
        totalPaid,
        totalDue,
      },
      fees,
    });
  } catch (error) {
    console.error("Get Student Fees Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student fees",
      error: error.message,
    });
  }
};

// ======================================================
// GET FEE BY ID
// ======================================================

const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      fee,
    });
  } catch (error) {
    console.error("Get Fee Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fee",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE FEE
// ======================================================

const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      fee[key] = req.body[key];
    });

    await fee.save();

    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      fee,
    });
  } catch (error) {
    console.error("Update Fee Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update fee",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE FEE
// ======================================================

const deleteFee = async (req, res) => {
  try {
    const deletedFee = await Fee.findByIdAndDelete(
      req.params.id
    );

    if (!deletedFee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Fee Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete fee",
      error: error.message,
    });
  }
};

export {
  addFee,
  getAllFees,
  getFeesByStudent,
  getFeeById,
  updateFee,
  deleteFee,
};
