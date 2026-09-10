import { useState, useEffect } from "react";
import { Menu, BookOpen, Clock, Users, Loader2 } from "lucide-react";
import TeacherAside from "../components/TeacherAside";
import api from "../services/api";

function MyClasses() {
  const [collapsed, setCollapsed] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await api.getClasses();
        if (data.success) {
          setClasses(data.classes || []);
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <TeacherAside collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <main className="flex-1 w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b px-4 sm:px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(false)}
              className="md:hidden text-blue-900"
            >
              <Menu size={24} />
            </button>

            <div>
              <p className="text-sm text-gray-500">Teacher Panel</p>
              <h1 className="font-bold text-gray-800">
                My Classes ({classes.length})
              </h1>
            </div>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            T
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Top Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <BookOpen size={18} />
                <p className="text-sm text-gray-500">Active Classes</p>
              </div>
              <h2 className="text-2xl font-bold mt-2">
                {classes.length}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Users size={18} />
                <p className="text-sm text-gray-500">Avg Capacity</p>
              </div>
              <h2 className="text-2xl font-bold mt-2">
                40
              </h2>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-orange-500">
                <Clock size={18} />
                <p className="text-sm text-gray-500">Academic Year</p>
              </div>
              <h2 className="text-2xl font-bold mt-2">
                2026-27
              </h2>
            </div>
          </div>

          {/* Classes */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800">
                Classes Schedule & Rooms
              </h2>
              <span className="text-sm text-gray-500 hidden sm:block">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-700" size={30} />
              </div>
            ) : classes.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No classes assigned in the database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-3">Class</th>
                      <th>Section</th>
                      <th>Room</th>
                      <th>Max Capacity</th>
                      <th>Class Teacher</th>
                      <th>Description</th>
                    </tr>
                  </thead>

                  <tbody>
                    {classes.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{item.className}</td>
                        <td>{item.section}</td>
                        <td>{item.roomNumber || "N/A"}</td>
                        <td>{item.maximumStudents || "N/A"} students</td>
                        <td className="text-blue-700">{item.classTeacher}</td>
                        <td className="text-gray-500">{item.description || "Regular Session"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyClasses;