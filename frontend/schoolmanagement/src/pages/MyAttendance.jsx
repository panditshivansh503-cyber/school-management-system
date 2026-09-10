import { useState, useEffect } from "react";
import StudentAside from "../components/StudentAside";
import { Menu, Loader2, CheckCircle, XCircle } from "lucide-react";
import api from "../services/api";

function MyAttendance() {
  const [collapsed, setCollapsed] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"Student","email":""}');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        if (currentUser.email) {
          const stRes = await api.getStudentProfile(currentUser.email);
          if (stRes.success && stRes.profile) {
            const attRes = await api.getAttendanceByStudent(stRes.profile._id);
            if (attRes.success) {
              setAttendanceRecords(attRes.attendance || []);
              const apiStats = attRes.stats || {};
              setStats({
                total: apiStats.totalDays || 0,
                present: apiStats.presentDays || 0,
                absent: apiStats.absentDays || 0,
                percentage: apiStats.percentage || 0,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load attendance records:", err);
      } finally {
        setLoading(false);
      }
    };
    void Promise.resolve().then(fetchAttendance);
  }, [currentUser.email]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <StudentAside collapsed={collapsed} setCollapsed={setCollapsed} />

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
              My Attendance Records
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold uppercase">
            {currentUser.name ? currentUser.name[0] : "S"}
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <Loader2 className="animate-spin text-blue-700" size={32} />
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Total Recorded Days</p>
                  <h2 className="text-2xl font-bold text-blue-700 mt-1">
                    {stats.total}
                  </h2>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Days Present</p>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    {stats.present}
                  </h2>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Days Absent</p>
                  <h2 className="text-2xl font-bold text-red-500 mt-1">
                    {stats.absent}
                  </h2>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Attendance Percentage</p>
                  <h2 className="text-2xl font-bold text-indigo-700 mt-1">
                    {stats.percentage}%
                  </h2>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto p-4">
                <h2 className="font-bold text-gray-800 mb-4">
                  Attendance History ({attendanceRecords.length} sessions)
                </h2>

                {attendanceRecords.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    No attendance records marked yet.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b text-left text-gray-600">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Class</th>
                        <th className="px-4 py-3">Marked By</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceRecords.map((item) => (
                        <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-4 py-3">{item.className} {item.section ? `(${item.section})` : ""}</td>
                          <td className="px-4 py-3 text-gray-500">{item.markedBy || "Teacher"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 ${
                                item.status === "Present"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.status === "Present" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyAttendance;