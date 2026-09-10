import { useState, useEffect } from "react";
import AdminAside from "../components/AdminAside";
import {
  Search,
  Plus,
  Trash2,
  Menu,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function StudentList() {
  const [collapsed, setCollapsed] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedClass !== "All") params.className = selectedClass;
      if (selectedSection !== "All") params.section = selectedSection;

      const data = await api.getStudents(params);
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(delayDebounce);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedClass, selectedSection]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.deleteStudent(id);
      setStudents(students.filter((st) => st._id !== id));
    } catch (err) {
      alert("Failed to delete student: " + err.message);
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
            {/* Mobile Menu */}
            <button
              onClick={() => setCollapsed(false)}
              className="md:hidden text-blue-900"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg font-bold text-gray-800">
              Students List ({students.length})
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
        </header>

        {/* Content */}
        <div className="p-5">
          {/* Controls */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative w-full md:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search student or admission..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-md py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="All">Class: All</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="All">Section: All</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>

              <Link
                to="/add-student"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 no-underline"
              >
                <Plus size={16} />
                Add Student
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-700" size={30} />
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No students found in the database.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left text-gray-600">
                    <th className="px-4 py-3">Admission No.</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-700">
                        {student.admissionNo}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-3">{student.className}</td>
                      <td className="px-4 py-3">{student.section}</td>
                      <td className="px-4 py-3">{student.mobile || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-500">{student.email || "N/A"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentList;