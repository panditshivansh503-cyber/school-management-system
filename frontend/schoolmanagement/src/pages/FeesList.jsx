import { useState, useEffect } from "react";
import AdminAside from "../components/AdminAside";
import {
  Menu,
  Search,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function FeesList() {
  const [collapsed, setCollapsed] = useState(false);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filterClass !== "All") params.className = filterClass;
      if (filterStatus !== "All") params.status = filterStatus;

      const data = await api.getFees(params);
      if (data.success) {
        setFees(data.fees || []);
      }
    } catch (err) {
      console.error("Failed to fetch fees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFees();
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterClass, filterStatus]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fee record?")) return;
    try {
      await api.deleteFee(id);
      setFees(fees.filter((f) => f._id !== id));
    } catch (err) {
      alert("Failed to delete fee: " + err.message);
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
              Fees List ({fees.length})
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Search + Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col lg:flex-row gap-3 justify-between">
            <div className="relative w-full lg:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search student or fee ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-md py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="All">All Classes</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>

              <Link
                to="/add-fee"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 no-underline"
              >
                <Plus size={16} />
                Add Fee
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-700" size={30} />
              </div>
            ) : fees.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No fee records found in the database.
              </div>
            ) : (
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left text-gray-600">
                    <th className="px-4 py-3">Fee ID</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Fee Type</th>
                    <th className="px-4 py-3">Total Fee</th>
                    <th className="px-4 py-3">Paid</th>
                    <th className="px-4 py-3">Due</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {fees.map((fee) => {
                    const due = (fee.totalFee || 0) - (fee.paidAmount || 0);
                    return (
                      <tr
                        key={fee._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-gray-700">{fee.feeId || "N/A"}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{fee.studentName}</td>
                        <td className="px-4 py-3">{fee.className} {fee.section ? `(${fee.section})` : ""}</td>
                        <td className="px-4 py-3 text-gray-600">{fee.feeType}</td>
                        <td className="px-4 py-3 font-medium">₹{(fee.totalFee || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">₹{(fee.paidAmount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-red-500 font-medium">₹{Math.max(0, due).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              fee.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : fee.status === "Partial"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(fee._id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Fee Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default FeesList;