import { useState, useEffect } from "react";
import { Menu, Users, BookOpen, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import TeacherAside from "../components/TeacherAside";
import api from "../services/api";

function TeacherDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"Teacher","email":""}');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        if (currentUser.email) {
          const data = await api.getTeacherDashboard(currentUser.email);
          if (data.success) {
            setDashboard(data.dashboard);
          }
        }
      } catch (err) {
        console.error("Failed to load teacher dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [currentUser.email]);

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

            <div>
              <p className="text-xs text-gray-500">Welcome Teacher,</p>
              <h1 className="font-bold text-gray-800 capitalize">
                {dashboard?.teacher?.name || currentUser.name || "Teacher"}
              </h1>
            </div>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold uppercase">
            {currentUser.name ? currentUser.name[0] : "T"}
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-blue-700" size={32} />
            </div>
          ) : (
            <>
              {/* Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Assigned Students</p>
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-700 mt-1">
                    {dashboard?.myStudents || 0}
                  </h2>
                  <Link to="/my-students" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                    View Students
                  </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">My Classes</p>
                    <BookOpen size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    {dashboard?.myClasses || 0}
                  </h2>
                  <Link to="/my-classes" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                    View Classes
                  </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Subject Specialization</p>
                    <Calendar size={20} className="text-orange-500" />
                  </div>
                  <h2 className="text-lg font-bold text-orange-600 mt-1 truncate">
                    {dashboard?.teacher?.subject || "General"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2">Active</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Attendance Action</p>
                    <CheckCircle size={20} className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-700 mt-1">
                    {dashboard?.attendance?.percentage || 0}%
                  </h2>
                  <Link to="/mark-attendance" className="text-xs text-purple-600 hover:underline mt-2 inline-block">
                    Mark Today
                  </Link>
                </div>
              </div>

              {/* Quick Action Banner */}
              <div className="mt-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Daily Attendance & Class Management</h2>
                  <p className="text-blue-200 text-sm mt-1">
                    Record student presence, monitor class performance, and manage your schedules seamlessly.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/mark-attendance"
                    className="bg-white text-blue-900 font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-blue-50 transition no-underline text-sm"
                  >
                    Mark Attendance
                  </Link>
                  <Link
                    to="/my-students"
                    className="bg-blue-800 text-white border border-blue-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition no-underline text-sm"
                  >
                    Student Roster
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;