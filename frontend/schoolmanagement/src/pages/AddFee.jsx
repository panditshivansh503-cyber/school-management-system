import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import { Menu, Loader2 } from "lucide-react";
import api from "../services/api";

function AddFee() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    feeId: `FEE_${Math.floor(1000 + Math.random() * 9000)}`,

    student: "",
    studentName: "",

    className: "",
    section: "",

    feeType: "Tuition Fee",

    totalFee: "",
    paidAmount: "",
    dueAmount: "",

    paymentDate: new Date().toISOString().split("T")[0],

    paymentMode: "Cash",

    status: "Pending",

    receiptNo: `REC_${Math.floor(10000 + Math.random() * 90000)}`,

    remarks: "",
  });

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setError("");

        const response = await api.getStudents();

        if (response.success) {
          setStudentsList(response.students || []);
        } else {
          setError(response.message || "Failed to load students");
        }
      } catch (err) {
        console.error("Load Students Error:", err);

        setError(
          err.message ||
            "Unable to load students. Please check authentication."
        );
      }
    };

    loadStudents();
  }, []);

  // =====================================================
  // STUDENT SELECT
  // =====================================================

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;

    setMessage("");
    setError("");

    const selectedStudent = studentsList.find(
      (student) => student._id === studentId
    );

    // ---------------------------------------------------
    // NO STUDENT SELECTED
    // ---------------------------------------------------

    if (!selectedStudent) {
      setFormData((prev) => ({
        ...prev,

        student: "",
        studentName: "",

        className: "",
        section: "",

        totalFee: "",
        paidAmount: "",
        dueAmount: "",

        status: "Pending",
      }));

      return;
    }

    // ---------------------------------------------------
    // STUDENT FEE CALCULATION
    // ---------------------------------------------------

    const totalStudentFee = Number(
      selectedStudent.totalFee || 0
    );

    const alreadyPaid = Number(
      selectedStudent.paidFee || 0
    );

    const remainingFee = Math.max(
      0,
      totalStudentFee - alreadyPaid
    );

    // ---------------------------------------------------
    // STUDENT CLASS
    // ---------------------------------------------------

    let studentClass = selectedStudent.className || "";

    /*
      Your Student record may contain:

      "8"

      or

      "Class 8"

      We keep whatever is actually stored
      in the student's database record.
    */

    if (
      typeof studentClass === "string" &&
      studentClass.trim() !== ""
    ) {
      studentClass = studentClass.trim();
    }

    // ---------------------------------------------------
    // STUDENT SECTION
    // ---------------------------------------------------

    const studentSection =
      selectedStudent.section || "";

    // ---------------------------------------------------
    // UPDATE FORM
    // ---------------------------------------------------

    setFormData((prev) => ({
      ...prev,

      student: selectedStudent._id,

      studentName:
        selectedStudent.studentName || "",

      className: studentClass,

      section: studentSection,

      /*
        Remaining fee becomes the amount
        available for this fee record.
      */

      totalFee: remainingFee,

      paidAmount: "",

      dueAmount: remainingFee,

      status:
        remainingFee === 0
          ? "Paid"
          : "Pending",
    }));
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMessage("");
    setError("");

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // -------------------------------------------------
      // FEE CALCULATION
      // -------------------------------------------------

      if (
        name === "totalFee" ||
        name === "paidAmount"
      ) {
        const total =
          Number(
            name === "totalFee"
              ? value
              : prev.totalFee
          ) || 0;

        const paid =
          Number(
            name === "paidAmount"
              ? value
              : prev.paidAmount
          ) || 0;

        // Paid cannot be greater than total
        if (paid > total) {
          updated.dueAmount = 0;

          updated.status = "Pending";

          return updated;
        }

        const due = Math.max(
          0,
          total - paid
        );

        updated.dueAmount = due;

        // -------------------------------------------------
        // STATUS
        // -------------------------------------------------

        if (due === 0 && total > 0) {
          updated.status = "Paid";
        } else if (paid > 0) {
          updated.status = "Partial";
        } else {
          updated.status = "Pending";
        }
      }

      return updated;
    });
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // ===================================================
    // REQUIRED VALIDATION
    // ===================================================

    if (!formData.student) {
      setError("Please select a student.");
      return;
    }

    if (!formData.studentName) {
      setError("Student name is missing.");
      return;
    }

    if (!formData.className) {
      setError("Student class is missing.");
      return;
    }

    if (!formData.totalFee) {
      setError("Please enter total fee.");
      return;
    }

    if (
      formData.paidAmount === "" ||
      formData.paidAmount === null
    ) {
      setError("Please enter paid amount.");
      return;
    }

    if (!formData.paymentDate) {
      setError("Please select payment date.");
      return;
    }

    // ===================================================
    // NUMBER CONVERSION
    // ===================================================

    const totalFee = Number(formData.totalFee);
    const paidAmount = Number(formData.paidAmount);

    // ===================================================
    // FEE VALIDATION
    // ===================================================

    if (Number.isNaN(totalFee) || totalFee < 0) {
      setError("Total fee must be a valid amount.");
      return;
    }

    if (
      Number.isNaN(paidAmount) ||
      paidAmount < 0
    ) {
      setError("Paid amount must be a valid amount.");
      return;
    }

    if (paidAmount > totalFee) {
      setError(
        "Paid amount cannot be greater than total fee."
      );
      return;
    }

    // ===================================================
    // CALCULATE DUE
    // ===================================================

    const dueAmount = Math.max(
      0,
      totalFee - paidAmount
    );

    let status = "Pending";

    if (dueAmount === 0 && totalFee > 0) {
      status = "Paid";
    } else if (paidAmount > 0) {
      status = "Partial";
    }

    // ===================================================
    // FINAL DATA
    // ===================================================

    const feeData = {
      ...formData,

      totalFee,
      paidAmount,
      dueAmount,
      status,
    };

    // ===================================================
    // API REQUEST
    // ===================================================

    try {
      setLoading(true);

      const response = await api.addFee(feeData);

      if (!response || !response.success) {
        throw new Error(
          response?.message ||
            "Failed to save fee record."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        response.message ||
          "Fee record saved successfully!"
      );

      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(() => {
        navigate("/fees");
      }, 800);
    } catch (err) {
      console.error(
        "Add Fee Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save fee record."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/fees");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminAside
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="flex-1 w-full">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="h-16 bg-white border-b px-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setCollapsed(false)
              }
              className="md:hidden text-blue-900"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg font-bold text-gray-800">
              Add Fee Record
            </h1>

          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>

        </header>

        {/* =================================================
            FORM CONTAINER
        ================================================= */}

        <div className="p-4 sm:p-6">

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 max-w-5xl">

            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Fee Information
            </h2>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (
              <div className="p-3 mb-4 rounded-md bg-green-50 text-green-700 text-sm border border-green-200">
                {message}
              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div className="p-3 mb-4 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >

              {/* =================================================
                  FEE ID
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Fee ID
                </label>

                <input
                  type="text"
                  name="feeId"
                  value={formData.feeId}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* =================================================
                  STUDENT
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Student *
                </label>

                <select
                  value={formData.student}
                  onChange={handleStudentSelect}
                  required
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                >

                  <option value="">
                    Select Student
                  </option>

                  {studentsList.map((student) => (
                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {student.studentName}
                      {" "}
                      ({student.admissionNo})
                      {" - "}
                      {student.className}
                    </option>
                  ))}

                </select>
              </div>

              {/* =================================================
                  CLASS - AUTO FROM STUDENT
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Class *
                </label>

                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  readOnly
                  placeholder="Select student first"
                  required
                  className="w-full border rounded-md p-2 text-sm bg-gray-50 text-gray-700 outline-none"
                />

                <p className="text-[11px] text-gray-400 mt-1">
                  Automatically taken from student
                </p>
              </div>

              {/* =================================================
                  SECTION - AUTO FROM STUDENT
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Section
                </label>

                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  readOnly
                  placeholder="Select student first"
                  className="w-full border rounded-md p-2 text-sm bg-gray-50 text-gray-700 outline-none"
                />

                <p className="text-[11px] text-gray-400 mt-1">
                  Automatically taken from student
                </p>
              </div>

              {/* =================================================
                  FEE TYPE
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Fee Type *
                </label>

                <select
                  name="feeType"
                  value={formData.feeType}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                >

                  <option value="Tuition Fee">
                    Tuition Fee
                  </option>

                  <option value="Admission Fee">
                    Admission Fee
                  </option>

                  <option value="Exam Fee">
                    Exam Fee
                  </option>

                  <option value="Transport Fee">
                    Transport Fee
                  </option>

                  <option value="Annual Charges">
                    Annual Charges
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>
              </div>

              {/* =================================================
                  TOTAL FEE
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Total Fee (₹) *
                </label>

                <input
                  type="number"
                  name="totalFee"
                  value={formData.totalFee}
                  onChange={handleChange}
                  placeholder="Total Fee"
                  required
                  min="0"
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* =================================================
                  PAID AMOUNT
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Paid Amount (₹) *
                </label>

                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  placeholder="Paid Amount"
                  required
                  min="0"
                  max={
                    formData.totalFee !== ""
                      ? formData.totalFee
                      : undefined
                  }
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* =================================================
                  DUE AMOUNT
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Due Amount (₹)
                </label>

                <input
                  type="number"
                  name="dueAmount"
                  value={formData.dueAmount}
                  readOnly
                  className="w-full border rounded-md p-2 text-sm bg-gray-50 text-gray-700 outline-none"
                />
              </div>

              {/* =================================================
                  PAYMENT DATE
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Payment Date *
                </label>

                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* =================================================
                  PAYMENT MODE
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Payment Mode *
                </label>

                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                >

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="Net Banking">
                    Net Banking
                  </option>

                  <option value="Cheque">
                    Cheque
                  </option>

                </select>
              </div>

              {/* =================================================
                  STATUS
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled
                  className="w-full border rounded-md p-2 text-sm bg-gray-50 text-gray-700 outline-none"
                >

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Partial">
                    Partial
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                </select>

                <p className="text-[11px] text-gray-400 mt-1">
                  Automatically calculated
                </p>
              </div>

              {/* =================================================
                  RECEIPT NUMBER
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Receipt No.
                </label>

                <input
                  type="text"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* =================================================
                  REMARKS
              ================================================= */}

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Remarks
                </label>

                <input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Optional remarks"
                  disabled={loading}
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-5 py-2 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-md text-sm flex items-center gap-2"
                >

                  {loading && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {loading
                    ? "Saving..."
                    : "Save Fee Record"}

                </button>

              </div>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AddFee;