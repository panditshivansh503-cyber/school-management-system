import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import { Menu } from "lucide-react";
import api from "../services/api";

function AddTeacher() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ==============================
  // FORM DATA
  // ==============================

  const [formData, setFormData] = useState({
    teacherId: "",
    teacherName: "",
    fatherName: "",
    dob: "",
    gender: "",
    subject: "",
    qualification: "",
    experience: "",
    mobile: "",
    email: "",
    joiningDate: "",
    password: "",
    address: "",
  });

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // RESET FORM
  // ==============================

  const resetForm = () => {
    setFormData({
      teacherId: "",
      teacherName: "",
      fatherName: "",
      dob: "",
      gender: "",
      subject: "",
      qualification: "",
      experience: "",
      mobile: "",
      email: "",
      joiningDate: "",
      password: "",
      address: "",
    });
  };

  // ==============================
  // SUBMIT FORM
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      // Use centralized API service.
      // It automatically sends the logged-in user's JWT token.
      await api.addTeacher(formData);

      setMessage("Teacher added successfully!");

      resetForm();

      // Redirect to teacher list
      setTimeout(() => {
        navigate("/teachers");
      }, 1000);
    } catch (error) {
      console.error("Add Teacher Error:", error);

      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CANCEL
  // ==============================

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ==============================
          SIDEBAR
      ============================== */}

      <AdminAside
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* ==============================
          MAIN
      ============================== */}

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
              Add Teacher
            </h1>

          </div>

          <div
            className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold"
            aria-label="Admin profile"
          >
            A
          </div>
        </header>

        {/* ==============================
            FORM CONTAINER
        ============================== */}

        <div className="p-4 sm:p-6">

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">

            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Teacher Information
            </h2>

            {/* MESSAGE */}

            {message && (
              <div
                className={`mb-4 p-3 rounded-md text-sm ${
                  message.toLowerCase().includes("success")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >

              {/* TEACHER ID */}

              <div>
                <label className="label">
                  Teacher ID
                </label>

                <input
                  className="input"
                  type="text"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  placeholder="Teacher ID"
                />
              </div>

              {/* TEACHER NAME */}

              <div>
                <label className="label">
                  Teacher Name *
                </label>

                <input
                  className="input"
                  type="text"
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  placeholder="Teacher Name"
                  required
                />
              </div>

              {/* FATHER NAME */}

              <div>
                <label className="label">
                  Father Name
                </label>

                <input
                  className="input"
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Father Name"
                />
              </div>

              {/* DOB */}

              <div>
                <label className="label">
                  Date of Birth
                </label>

                <input
                  className="input"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
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

              {/* SUBJECT */}

              <div>
                <label className="label">
                  Subject *
                </label>

                <select
                  className="input"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Subject
                  </option>

                  <option value="Maths">
                    Maths
                  </option>

                  <option value="Physics">
                    Physics
                  </option>

                  <option value="Chemistry">
                    Chemistry
                  </option>

                  <option value="English">
                    English
                  </option>

                  <option value="Computer">
                    Computer
                  </option>
                </select>
              </div>

              {/* QUALIFICATION */}

              <div>
                <label className="label">
                  Qualification
                </label>

                <input
                  className="input"
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="Qualification"
                />
              </div>

              {/* EXPERIENCE */}

              <div>
                <label className="label">
                  Experience
                </label>

                <input
                  className="input"
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3 Years"
                />
              </div>

              {/* MOBILE */}

              <div>
                <label className="label">
                  Mobile *
                </label>

                <input
                  className="input"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="label">
                  Email *
                </label>

                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>

              {/* JOINING DATE */}

              <div>
                <label className="label">
                  Joining Date
                </label>

                <input
                  className="input"
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
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
                  placeholder="Password"
                  required
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
                  placeholder="Teacher Address"
                />

              </div>

              {/* BUTTONS */}

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-5 py-2 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Teacher"}
                </button>

              </div>

            </form>
          </div>
        </div>
      </main>

      {/* ==============================
          CSS
      ============================== */}

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
      `}</style>

    </div>
  );
}

export default AddTeacher;