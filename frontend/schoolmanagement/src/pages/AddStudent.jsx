import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import { Menu } from "lucide-react";
import api from "../services/api";

function AddStudent() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    admissionNo: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    className: "",
    section: "",
    rollNumber: "",
    mobile: "",
    email: "",
    password: "",
    totalFee: "",
    paidFee: "",
    address: "",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "paidFee") {
      const paid = Number(value);
      const total = Number(formData.totalFee);

      if (value !== "" && paid > total) {
        setMessage("Paid fee cannot be greater than total fee");
        return;
      }
    }

    setMessage("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      admissionNo: "",
      studentName: "",
      fatherName: "",
      motherName: "",
      dob: "",
      gender: "",
      className: "",
      section: "",
      rollNumber: "",
      mobile: "",
      email: "",
      password: "",
      totalFee: "",
      paidFee: "",
      address: "",
    });
  };

  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalFee = Number(formData.totalFee);
    const paidFee = Number(formData.paidFee);

    if (formData.totalFee === "") {
      setMessage("Please enter total fee");
      return;
    }

    if (formData.paidFee === "") {
      setMessage("Please enter paid fee");
      return;
    }

    if (totalFee < 0 || paidFee < 0) {
      setMessage("Fee cannot be negative");
      return;
    }

    if (paidFee > totalFee) {
      setMessage("Paid fee cannot be greater than total fee");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.addStudent({
        ...formData,
        totalFee,
        paidFee,
      });

      setMessage("Student added successfully!");

      resetForm();
    } catch (error) {
      console.error("Add Student Error:", error);

      setMessage(
        error.message || "Failed to add student"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REMAINING FEE
  // =========================

  const remainingFee =
    Number(formData.totalFee || 0) -
    Number(formData.paidFee || 0);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}

      <AdminAside
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN */}

      <main className="flex-1 w-full">

        {/* HEADER */}

        <header className="h-16 bg-white border-b px-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setCollapsed(false)}
              className="md:hidden text-blue-900"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg font-bold text-gray-800">
              Add Student
            </h1>

          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>

        </header>

        {/* FORM CONTAINER */}

        <div className="p-4 sm:p-6">

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">

            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Student Information
            </h2>

            {/* MESSAGE */}

            {message && (
              <div
                className={`mb-4 p-3 rounded-md text-sm ${
                  message.includes("successfully")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >

              {/* ADMISSION NUMBER */}

              <div>
                <label className="label">
                  Admission No.
                </label>

                <input
                  className="input"
                  type="text"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  placeholder="Admission No."
                />
              </div>

              {/* STUDENT NAME */}

              <div>
                <label className="label">
                  Student Name *
                </label>

                <input
                  className="input"
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Student Name"
                  required
                />
              </div>

              {/* FATHER NAME */}

              <div>
                <label className="label">
                  Father Name *
                </label>

                <input
                  className="input"
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Father Name"
                  required
                />
              </div>

              {/* MOTHER NAME */}

              <div>
                <label className="label">
                  Mother Name
                </label>

                <input
                  className="input"
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder="Mother Name"
                />
              </div>

              {/* DOB */}

              <div>
                <label className="label">
                  Date of Birth *
                </label>

                <input
                  className="input"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* GENDER */}

              <div>
                <label className="label">
                  Gender
                </label>

                <select
                  className="input"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
              </div>

              {/* CLASS */}

              <div>
                <label className="label">
                  Class
                </label>

                <select
                  className="input"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Class
                  </option>

                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>

              {/* SECTION */}

              <div>
                <label className="label">
                  Section
                </label>

                <select
                  className="input"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Section
                  </option>

                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              {/* ROLL NUMBER */}

              <div>
                <label className="label">
                  Roll Number
                </label>

                <input
                  className="input"
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="Roll Number"
                />
              </div>

              {/* MOBILE */}

              <div>
                <label className="label">
                  Mobile
                </label>

                <input
                  className="input"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="label">
                  Email
                </label>

                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="label">
                  Password *
                </label>

                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />
              </div>

              {/* TOTAL FEE */}

              <div>
                <label className="label">
                  Total Fee *
                </label>

                <input
                  className="input"
                  type="number"
                  name="totalFee"
                  value={formData.totalFee}
                  onChange={handleChange}
                  placeholder="Enter Total Fee"
                  min="0"
                  required
                />
              </div>

              {/* PAID FEE */}

              <div>
                <label className="label">
                  Paid Fee *
                </label>

                <input
                  className="input"
                  type="number"
                  name="paidFee"
                  value={formData.paidFee}
                  onChange={handleChange}
                  placeholder="Enter Paid Fee"
                  min="0"
                  max={formData.totalFee || undefined}
                  required
                />
              </div>

              {/* REMAINING FEE */}

              <div>
                <label className="label">
                  Remaining Fee
                </label>

                <input
                  className="input bg-gray-100"
                  type="number"
                  value={remainingFee}
                  readOnly
                />
              </div>

              {/* ADDRESS */}

              <div className="sm:col-span-2 lg:col-span-3">

                <label className="label">
                  Address
                </label>

                <textarea
                  rows="3"
                  className="input resize-none"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Student Address"
                />

              </div>

              {/* BUTTONS */}

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => navigate("/students")}
                  disabled={loading}
                  className="px-5 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-md text-sm"
                >
                  {loading ? "Saving..." : "Save Student"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </main>

      {/* CSS */}

      <style>{`
        .label {
          display: block;
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 5px;
        }

        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 9px 10px;
          font-size: 14px;
          outline: none;
        }

        .input:focus {
          border-color: #2563eb;
        }

        .input:disabled {
          cursor: not-allowed;
        }
      `}</style>

    </div>
  );
}

export default AddStudent;