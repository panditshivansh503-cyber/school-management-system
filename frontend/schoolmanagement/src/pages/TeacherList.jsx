import { useState, useEffect } from "react";
import AdminAside from "../components/AdminAside";
import { Link } from "react-router-dom";
import {
  Menu,
  Search,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import api from "../services/api";

function TeacherList() {
  const [collapsed, setCollapsed] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      const data = await api.getTeachers(params);
      if (data.success) {
        setTeachers(data.teachers || []);
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await api.deleteTeacher(id);
      setTeachers(teachers.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete teacher: " + err.message);
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
              Teachers List ({teachers.length})
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
        </header>

        <div className="p-4 sm:p-5">
          {/* Search + Add */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative w-full sm:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search teacher or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-md py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <Link
              to="/add-teachers"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 no-underline"
            >
              <Plus size={16} />
              Add Teacher
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-700" size={30} />
              </div>
            ) : teachers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No teachers found in the database.
              </div>
            ) : (
              <table className="w-full min-w-[650px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left text-gray-600">
                    <th className="px-4 py-3">Teacher ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-700">
                        {teacher.teacherId || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {teacher.teacherName}
                      </td>
                      <td className="px-4 py-3 text-blue-700">{teacher.subject}</td>
                      <td className="px-4 py-3">{teacher.mobile}</td>
                      <td className="px-4 py-3 text-gray-500">{teacher.email}</td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(teacher._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Teacher"
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

export default TeacherList;