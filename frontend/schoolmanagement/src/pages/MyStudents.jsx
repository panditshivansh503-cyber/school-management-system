import { useState, useEffect } from "react";
import TeacherAside from "../components/TeacherAside";
import {
  Menu,
  Search,
  Loader2,
} from "lucide-react";
import api from "../services/api";

function MyStudents() {
  const [collapsed, setCollapsed] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      const data = await api.getStudents(params);
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <TeacherAside collapsed={collapsed} setCollapsed={setCollapsed} />

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
              My Students Roster ({students.length})
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            T
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="relative w-full sm:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search student or admission no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-md py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-700" size={30} />
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No students found in the roster.
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left text-gray-600">
                    <th className="px-4 py-3">Admission No.</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Guardian</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-700">{student.admissionNo}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{student.studentName}</td>
                      <td className="px-4 py-3">{student.className}</td>
                      <td className="px-4 py-3">{student.section}</td>
                      <td className="px-4 py-3">{student.mobile || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-600">{student.fatherName || "N/A"}</td>
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

export default MyStudents;