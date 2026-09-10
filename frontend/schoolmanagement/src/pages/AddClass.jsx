import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import { Menu } from "lucide-react";

function AddClass() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ======================================================
  // INITIAL FORM DATA
  // ======================================================

  const initialFormData = {
    classId: "",
    className: "",
    section: "",
    classTeacher: "",
    roomNumber: "",
    maximumStudents: "",
    subject: "",
    academicYear: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ======================================================
  // GET AUTH TOKEN
  // ======================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken")
    );
  };

  // ======================================================
  // ADD CLASS API
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // ====================================================
    // FRONTEND VALIDATION
    // ====================================================

    if (!formData.className) {
      setError("Please select a class.");
      return;
    }

    if (!formData.section) {
      setError("Please select a section.");
      return;
    }

    if (!formData.classTeacher.trim()) {
      setError("Please enter class teacher name.");
      return;
    }

    if (!formData.academicYear) {
      setError("Please select academic year.");
      return;
    }

    // ====================================================
    // AUTHENTICATION
    // ====================================================

    const token = getToken();

    if (!token) {
      setError(
        "Authentication required. Please login again."
      );

      setTimeout(() => {
        navigate("/");
      }, 1500);

      return;
    }

    // ====================================================
    // API REQUEST
    // ====================================================

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/add-class",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      // ==================================================
      // SAFE JSON RESPONSE
      // ==================================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // ==================================================
      // TOKEN EXPIRED / INVALID
      // ==================================================

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");

        setError(
          "Your session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/");
        }, 1500);

        return;
      }

      // ==================================================
      // NO PERMISSION
      // ==================================================

      if (response.status === 403) {
        setError(
          data.message ||
            "You do not have permission to add a class."
        );

        return;
      }

      // ==================================================
      // OTHER API ERROR
      // ==================================================

      if (!response.ok) {
        setError(
          data.message || "Failed to add class."
        );

        return;
      }

      // ==================================================
      // SUCCESS
      // ==================================================

      setMessage(
        data.message || "Class added successfully!"
      );

      // Clear form
      setFormData(initialFormData);

      // ==================================================
      // GO TO CLASS LIST
      // ==================================================

      setTimeout(() => {
        navigate("/classes");
      }, 1000);
    } catch (err) {
      console.error("Add Class Error:", err);

      setError(
        "Server connection failed. Make sure your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CANCEL
  // ======================================================

  const handleCancel = () => {
    setFormData(initialFormData);
    setMessage("");
    setError("");
    navigate("/classes");
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <AdminAside
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="flex-1 min-w-0 w-full">
        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="h-16 bg-white border-b px-4 sm:px-5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="md:hidden text-blue-900 p-1"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg font-bold text-gray-800">
              Add Class
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
        </header>

        {/* ==================================================
            FORM CONTAINER
        ================================================== */}

        <div className="p-3 sm:p-5 lg:p-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Class Information
            </h2>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {message && (
              <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">
                {message}
              </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {/* ==================================================
                  CLASS ID
              ================================================== */}

              <div>
                <label className="label">
                  Class ID
                </label>

                <input
                  className="input"
                  type="text"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  placeholder="Class ID"
                />
              </div>

              {/* ==================================================
                  CLASS
              ================================================== */}

              <div>
                <label className="label">
                  Class *
                </label>

                <select
                  className="input"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Class
                  </option>

                  <option value="Class 6">
                    Class 6
                  </option>

                  <option value="Class 7">
                    Class 7
                  </option>

                  <option value="Class 8">
                    Class 8
                  </option>

                  <option value="Class 9">
                    Class 9
                  </option>

                  <option value="Class 10">
                    Class 10
                  </option>

                  <option value="Class 11">
                    Class 11
                  </option>

                  <option value="Class 12">
                    Class 12
                  </option>
                </select>
              </div>

              {/* ==================================================
                  SECTION
              ================================================== */}

              <div>
                <label className="label">
                  Section *
                </label>

                <select
                  className="input"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Section
                  </option>

                  <option value="A">
                    A
                  </option>

                  <option value="B">
                    B
                  </option>

                  <option value="C">
                    C
                  </option>
                </select>
              </div>

              {/* ==================================================
                  CLASS TEACHER
              ================================================== */}

              <div>
                <label className="label">
                  Class Teacher *
                </label>

                <input
                  className="input"
                  type="text"
                  name="classTeacher"
                  value={formData.classTeacher}
                  onChange={handleChange}
                  placeholder="Class Teacher"
                  required
                />
              </div>

              {/* ==================================================
                  ROOM NUMBER
              ================================================== */}

              <div>
                <label className="label">
                  Room Number
                </label>

                <input
                  className="input"
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="Room Number"
                />
              </div>

              {/* ==================================================
                  MAXIMUM STUDENTS
              ================================================== */}

              <div>
                <label className="label">
                  Maximum Students
                </label>

                <input
                  className="input"
                  type="number"
                  name="maximumStudents"
                  value={formData.maximumStudents}
                  onChange={handleChange}
                  placeholder="Maximum Students"
                  min="1"
                />
              </div>

              {/* ==================================================
                  SUBJECT
              ================================================== */}

              <div>
                <label className="label">
                  Subject
                </label>

                <input
                  className="input"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                />
              </div>

              {/* ==================================================
                  ACADEMIC YEAR
              ================================================== */}

              <div>
                <label className="label">
                  Academic Year *
                </label>

                <select
                  className="input"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Year
                  </option>

                  <option value="2026-27">
                    2026-27
                  </option>

                  <option value="2027-28">
                    2027-28
                  </option>

                  <option value="2028-29">
                    2028-29
                  </option>
                </select>
              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="label">
                  Description
                </label>

                <textarea
                  rows="3"
                  className="input resize-none"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Class description"
                />
              </div>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div className="sm:col-span-2 lg:col-span-3 flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-md text-sm font-medium"
                >
                  {loading ? "Saving..." : "Save Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ==================================================
          SIMPLE CSS
      ================================================== */}

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
          background-color: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default AddClass;