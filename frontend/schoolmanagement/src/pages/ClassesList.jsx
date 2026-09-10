import { useState, useEffect } from "react";
import AdminAside from "../components/AdminAside";
import { Link } from "react-router-dom";
import {
  Menu,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import api from "../services/api";

function ClassesList() {
  const [collapsed, setCollapsed] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("All");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterClass !== "All") params.className = filterClass;
      const data = await api.getClasses(params);
      if (data.success) {
        setClasses(data.classes || []);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchClasses);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterClass]);


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await api.deleteClass(id);
      setClasses(classes.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete class: " + err.message);
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
              Classes List ({classes.length})
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Top Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row gap-3 justify-between">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm outline-none w-full sm:w-52"
            >
              <option value="All">All Classes</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>

            <Link
              to="/add-class"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 no-underline"
            >
              <Plus size={16} />
              Add Class
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-700" size={30} />
              </div>
            ) : classes.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No classes registered in the database.
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left text-gray-600">
                    <th className="px-4 py-3">Class ID</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Class Teacher</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {classes.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-700">{item.classId || "N/A"}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.className}</td>
                      <td className="px-4 py-3">{item.section}</td>
                      <td className="px-4 py-3">{item.roomNumber || "N/A"}</td>
                      <td className="px-4 py-3">{item.maximumStudents || "N/A"}</td>
                      <td className="px-4 py-3 text-blue-700">{item.classTeacher}</td>
                      <td className="px-4 py-3 text-gray-500">{item.academicYear}</td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Class"
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

export default ClassesList;