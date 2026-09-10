import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema(
  {
    feeId: {
      type: String,
      unique: true,
      trim: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      trim: true,
    },

    feeType: {
      type: String,
      required: true,
      enum: [
        "Tuition Fee",
        "Admission Fee",
        "Exam Fee",
        "Transport Fee",
        "Other",
        "Annual Charges",
      ],
    },

    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    dueAmount: {
      type: Number,
      min: 0,
    },

    paymentDate: {
      type: Date,
      required: true,
    },

    paymentMode: {
      type: String,
      required: true,
      enum: ["Cash", "UPI", "Card", "Bank Transfer"],
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Partial"],
      default: "Pending",
    },

    receiptNo: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate due amount and status before saving
FeeSchema.pre("save", function () {
  this.dueAmount = this.totalFee - this.paidAmount;

  if (this.dueAmount <= 0) {
    this.status = "Paid";
    this.dueAmount = 0;
  } else if (this.paidAmount > 0) {
    this.status = "Partial";
  } else {
    this.status = "Pending";
  }
});

const Fee = mongoose.models.Fee || mongoose.model("Fee", FeeSchema);

export default Fee;