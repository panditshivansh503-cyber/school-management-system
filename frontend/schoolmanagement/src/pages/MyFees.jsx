import { useState, useEffect } from "react";
import StudentAside from "../components/StudentAside";
import { Menu, Loader2, IndianRupee } from "lucide-react";
import api from "../services/api";

function MyFees() {
  const [collapsed, setCollapsed] = useState(false);
  const [student, setStudent] = useState(null);
  const [feesList, setFeesList] = useState([]);
  const [summary, setSummary] = useState({ totalFees: 0, totalPaid: 0, totalDue: 0 });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"Student","email":""}');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        if (currentUser.email) {
          const stRes = await api.getStudentProfile(currentUser.email);
          if (stRes.success && stRes.profile) {
            setStudent(stRes.profile);
            const feeRes = await api.getFeesByStudent(stRes.profile._id);
            if (feeRes.success) {
              setFeesList(feeRes.fees || []);
              setSummary(feeRes.summary || {
                totalFees: stRes.profile.totalFee || 0,
                totalPaid: stRes.profile.paidFee || 0,
                totalDue: Math.max(0, (stRes.profile.totalFee || 0) - (stRes.profile.paidFee || 0)),
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load student fees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
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
              My Fees & Payment Receipts
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
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Total Assigned Fee</p>
                    <IndianRupee size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-700 mt-2">
                    ₹{(summary.totalFees || student?.totalFee || 0).toLocaleString()}
                  </h2>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Total Paid Amount</p>
                    <IndianRupee size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mt-2">
                    ₹{(summary.totalPaid || student?.paidFee || 0).toLocaleString()}
                  </h2>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Total Remaining Due</p>
                    <IndianRupee size={20} className="text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-500 mt-2">
                    ₹{Math.max(0, summary.totalDue ?? ((student?.totalFee || 0) - (student?.paidFee || 0))).toLocaleString()}
                  </h2>
                </div>
              </div>

              {/* Receipts Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto p-5">
                <h2 className="font-bold text-gray-800 mb-4">
                  Fee Transactions & Receipts
                </h2>

                {feesList.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No separate fee installments recorded yet.</p>
                    <p className="text-xs text-gray-400 mt-1">General admission total: ₹{(student?.totalFee || 0).toLocaleString()} (Paid: ₹{(student?.paidFee || 0).toLocaleString()})</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b text-left text-gray-600">
                        <th className="px-4 py-3">Receipt No</th>
                        <th className="px-4 py-3">Fee Type</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Mode</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Paid</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {feesList.map((fee) => (
                        <tr key={fee._id} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-semibold text-gray-700">{fee.receiptNo || fee.feeId || "N/A"}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{fee.feeType}</td>
                          <td className="px-4 py-3 text-gray-600">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : "N/A"}</td>
                          <td className="px-4 py-3 text-gray-600">{fee.paymentMode}</td>
                          <td className="px-4 py-3 font-medium">₹{(fee.totalFee || 0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-green-600 font-medium">₹{(fee.paidAmount || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                fee.status === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {fee.status}
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

export default MyFees;