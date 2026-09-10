import { useState, useEffect } from "react";
import TeacherAside from "../components/TeacherAside";
import {
  Menu,
  Check,
  X as XIcon,
  Loader2,
} from "lucide-react";
import api from "../services/api";

function MarkAttendance() {
  const [collapsed, setCollapsed] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [classesList, setClassesList] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await api.getClasses();
        if (data.success && data.classes?.length > 0) {
          setClassesList(data.classes);
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");
        const data = await api.getStudentsForAttendance({
          className: selectedClass,
          section: selectedSection,
        });

        if (data.success) {
          setStudents(data.students || []);
          const initial = {};
          (data.students || []).forEach((st) => {
            initial[st._id] = "Present";
          });
          setAttendance(initial);
        }
      } catch (err) {
        console.error("Failed to load students for attendance:", err);
        setError("Failed to load students for this class.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass, selectedSection]);

  const mark = (id, value) => {
    setAttendance((prev) => ({ ...prev, [id]: value }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((st) => {
      updated[st._id] = status;
    });
    setAttendance(updated);
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      setError("No students to mark attendance for.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const attendanceRecords = students.map((st) => ({
        studentId: st._id,
        studentName: st.studentName,
        status: attendance[st._id] || "Present",
      }));

      const payload = {
        date,
        className: selectedClass,
        section: selectedSection,
        attendance: attendanceRecords,
      };

      const res = await api.markAttendance(payload);
      if (res.success) {
        setMessage(`Successfully marked attendance for ${res.count || students.length} students!`);
      }
    } catch (err) {
      setError(err.message || "Failed to submit attendance.");
    } finally {
      setSaving(false);
    }
  };

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
              Mark Student Attendance
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            T
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Top Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-600"
              >
                {classesList.length > 0 ? (
                  Array.from(new Set(classesList.map((c) => c.className))).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
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

            <div>
              <label className="block text-xs text-gray-500 mb-1">Select Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-600"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

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

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto p-4">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h2 className="font-bold text-gray-800">
                Class Roster ({students.length} students)
              </h2>

              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => markAll("Present")}
                  className="px-3 py-1.5 bg-green-100 text-green-700 font-medium rounded hover:bg-green-200 transition"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll("Absent")}
                  className="px-3 py-1.5 bg-red-100 text-red-700 font-medium rounded hover:bg-red-200 transition"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-700" size={30} />
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No students enrolled in {selectedClass} ({selectedSection}).
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-600">
                    <th className="px-4 py-3">Roll No</th>
                    <th className="px-4 py-3">Admission No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Class & Section</th>
                    <th className="px-4 py-3 text-center">Status Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((st) => {
                    const status = attendance[st._id] || "Present";
                    return (
                      <tr key={st._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-semibold">{st.rollNumber || "-"}</td>
                        <td className="px-4 py-3 text-gray-600">{st.admissionNo}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{st.studentName}</td>
                        <td className="px-4 py-3">{st.className} - {st.section}</td>

                        <td className="px-4 py-3 flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => mark(st._id, "Present")}
                            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition ${
                              status === "Present"
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                            }`}
                          >
                            <Check size={14} />
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() => mark(st._id, "Absent")}
                            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition ${
                              status === "Absent"
                                ? "bg-red-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700"
                            }`}
                          >
                            <XIcon size={14} />
                            Absent
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {students.length > 0 && (
              <div className="flex justify-end pt-5">
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  disabled={saving}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-md text-sm font-semibold shadow flex items-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "Saving Attendance..." : "Save Attendance to Database"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MarkAttendance;