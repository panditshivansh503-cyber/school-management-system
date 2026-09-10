import { useState, useEffect } from "react";
import { Menu, Users, GraduationCap, BookOpen, IndianRupee, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import api from "../services/api";

function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"Admin"}');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await api.getAdminDashboard();
        if (data.success) {
          setDashboard(data.dashboard);
        }
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

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

            <div>
              <p className="text-xs text-gray-500">Welcome,</p>
              <h1 className="font-bold text-gray-800 capitalize">
                {currentUser.name || "Principal Admin"}
              </h1>
            </div>
          </div>

          {/* Profile Badge */}
          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold uppercase">
            {currentUser.name ? currentUser.name[0] : "A"}
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
                    <p className="text-sm text-gray-500">Students</p>
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-700 mt-1">
                    {dashboard?.totalStudents || 0}
                  </h2>
                  <Link to="/students" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                    View All
                  </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Teachers</p>
                    <GraduationCap size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    {dashboard?.totalTeachers || 0}
                  </h2>
                  <Link to="/teachers" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                    View All
                  </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Classes</p>
                    <BookOpen size={20} className="text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-700 mt-1">
                    {dashboard?.totalClasses || 0}
                  </h2>
                  <Link to="/classes" className="text-xs text-indigo-600 hover:underline mt-2 inline-block">
                    View All
                  </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Total Fees</p>
                    <IndianRupee size={20} className="text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-orange-500 mt-1">
                    ₹{(dashboard?.totalFees || 0).toLocaleString()}
                  </h2>
                  <Link to="/fees" className="text-xs text-orange-600 hover:underline mt-2 inline-block">
                    View All
                  </Link>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid lg:grid-cols-3 gap-5 mt-5">
                {/* Recent Students */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800">
                      Recent Students
                    </h2>
                    <Link to="/students" className="text-blue-600 text-sm hover:underline">
                      View All
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-gray-500">
                          <th className="py-3">Name</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard?.recentStudents?.length > 0 ? (
                          dashboard.recentStudents.map((st) => (
                            <tr key={st._id} className="border-b hover:bg-gray-50">
                              <td className="py-3 font-medium text-gray-800">{st.studentName}</td>
                              <td>{st.className}</td>
                              <td>{st.section}</td>
                              <td className="text-gray-500">
                                {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : "N/A"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-gray-400">
                              No students registered yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Attendance */}
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h2 className="font-bold text-gray-800 mb-5">
                    Today's Attendance
                  </h2>

                  <div className="flex justify-center">
                    <div className="w-36 h-36 rounded-full border-[12px] border-green-500 flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {dashboard?.attendance?.percentage || 0}%
                        </h2>
                        <p className="text-xs text-gray-500">Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-around mt-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-green-600">
                        {dashboard?.attendance?.present || 0}
                      </p>
                      <p className="text-gray-500">Present</p>
                    </div>

                    <div className="text-center">
                      <p className="font-bold text-red-500">
                        {dashboard?.attendance?.absent || 0}
                      </p>
                      <p className="text-gray-500">Absent</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;