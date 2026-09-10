import { useState, useEffect } from "react";
import StudentAside from "../components/StudentAside";
import { Menu, Loader2, CheckCircle, IndianRupee, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function StudentDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"Student","email":""}');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        if (currentUser.email) {
          const data = await api.getStudentDashboard(currentUser.email);
          if (data.success) {
            setDashboard(data.dashboard);
          }
        }
      } catch (err) {
        console.error("Failed to load student dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [currentUser.email]);

  const studentInfo = dashboard?.student || {};
  const attendance = dashboard?.attendance || {};
  const fees = dashboard?.fees || {};

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

            <div>
              <p className="text-xs text-gray-500">Welcome,</p>
              <h1 className="font-bold text-gray-800 capitalize">
                {studentInfo.name || currentUser.name || "Student"}
              </h1>
            </div>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold uppercase">
            {studentInfo.name ? studentInfo.name[0] : "S"}
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
              {/* Student Info Card */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-xl p-5 mb-5 shadow-sm">
                <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">Active Student Portal</p>
                <h2 className="text-2xl font-bold mt-1">{studentInfo.name || currentUser.name}</h2>
                <div className="flex flex-wrap gap-4 text-xs text-blue-100 mt-2">
                  <span>Class: <strong className="text-white">{studentInfo.className || "N/A"} ({studentInfo.section || "N/A"})</strong></span>
                  <span>Roll Number: <strong className="text-white">{studentInfo.rollNumber || "N/A"}</strong></span>
                  <span>Admission No: <strong className="text-white">{studentInfo.admissionNo || "N/A"}</strong></span>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Attendance Rate</p>
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    {attendance.percentage || 0}%
                  </h2>
                  <Link to="/my-attendance" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                    View Records ({attendance.presentDays || 0}/{attendance.totalDays || 0})
                  </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Enrolled Subjects</p>
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-700 mt-1">
                    {dashboard?.subjects || 4}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2">Core Curriculum</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Total Fee</p>
                    <IndianRupee size={20} className="text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-700 mt-1">
                    ₹{(fees.totalFee || 0).toLocaleString()}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2">Annual</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Pending Due</p>
                    <IndianRupee size={20} className="text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-500 mt-1">
                    ₹{(fees.remainingFee || 0).toLocaleString()}
                  </h2>
                  <Link to="/my-fees" className="text-xs text-red-600 hover:underline mt-2 inline-block">
                    Payment History
                  </Link>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="grid lg:grid-cols-2 gap-5 mt-5">
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h2 className="font-bold text-gray-800 mb-4">
                    Attendance Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-600">Total Recorded School Days</span>
                      <span className="font-semibold text-gray-800">{attendance.totalDays || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-600">Days Present</span>
                      <span className="font-semibold text-green-600">{attendance.presentDays || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-600">Days Absent</span>
                      <span className="font-semibold text-red-500">{attendance.absentDays || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h2 className="font-bold text-gray-800 mb-4">
                    Fee Status Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-600">Total Assigned Fee</span>
                      <span className="font-semibold text-gray-800">₹{(fees.totalFee || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-600">Total Paid</span>
                      <span className="font-semibold text-green-600">₹{(fees.paidFee || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-600">Balance Due</span>
                      <span className="font-semibold text-red-500">₹{(fees.remainingFee || 0).toLocaleString()}</span>
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

export default StudentDashboard;