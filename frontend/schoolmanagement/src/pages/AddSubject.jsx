import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import { Menu, Loader2 } from "lucide-react";
import api from "../services/api";

function AddSubject() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classesList, setClassesList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => ({
    subjectId: `SUB_${Math.floor(100 + Math.random() * 900)}`,
    subjectName: "",
    className: "",
    section: "A",
    teacher: "",
    subjectCode: "",
    description: "",
  }));

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [clsRes, tchRes] = await Promise.all([
          api.getClasses(),
          api.getTeachers(),
        ]);
        if (clsRes.success) setClassesList(clsRes.classes || []);
        if (tchRes.success) setTeachersList(tchRes.teachers || []);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.subjectName || !formData.className || !formData.section || !formData.teacher) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.addSubject(formData);
      if (res.success) {
        setMessage("Subject added successfully!");
        setTimeout(() => {
          navigate("/subjects");
        }, 800);
      }
    } catch (err) {
      setError(err.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminAside collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <main className="flex-1 w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(false)}
              className="md:hidden text-blue-900"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg font-bold text-gray-800">
              Add Subject
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
        </header>

        {/* Form */}
        <div className="p-4 sm:p-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 max-w-4xl">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Subject Information
            </h2>

            {message && (
              <div className="p-3 mb-4 rounded-md bg-green-50 text-green-700 text-sm border border-green-200">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Subject ID */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Subject ID</label>
                <input
                  type="text"
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  placeholder="Subject ID"
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* Subject Name */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Subject Name *</label>
                <input
                  type="text"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                  required
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Class *</label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                >
                  <option value="">Select Class</option>
                  {classesList.length > 0 ? (
                    classesList.map((c) => (
                      <option key={c._id} value={c.className}>
                        {c.className} ({c.section})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                    </>
                  )}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Section *</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Teacher *</label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                >
                  <option value="">Select Teacher</option>
                  {teachersList.length > 0 ? (
                    teachersList.map((t) => (
                      <option key={t._id} value={t.teacherName}>
                        {t.teacherName} ({t.subject})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Amit Verma">Amit Verma</option>
                      <option value="Ravi Kumar">Ravi Kumar</option>
                      <option value="Neha Singh">Neha Singh</option>
                      <option value="Priya Sharma">Priya Sharma</option>
                    </>
                  )}
                </select>
              </div>

              {/* Subject Code */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Subject Code</label>
                <input
                  type="text"
                  name="subjectCode"
                  value={formData.subjectCode}
                  onChange={handleChange}
                  placeholder="e.g. MTH101"
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                />
              </div>

              {/* Full Width Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Subject syllabus summary or details"
                  className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/subjects")}
                  className="px-5 py-2 border rounded-md text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm flex items-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Saving..." : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddSubject;