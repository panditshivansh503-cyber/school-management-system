import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User, Lock, Eye, EyeOff, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import college from "../assets/college.jpg";
import api from "../services/api";

const dashboardForRole = (role) => ({
  principal: "/admin-dashboard",
  teacher: "/dashboard",
  student: "/student-dashboard",
}[role] || "/");

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user?.role) navigate(dashboardForRole(user.role), { replace: true });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Please enter your email and password.");
    if (!role) return setError("Please select your role.");

    try {
      setLoading(true);
      const data = await api.login(email.trim(), password);
      const userRole = data.user?.role;
      const selectedRole = role === "admin" ? "principal" : role;

      if (!userRole || userRole !== selectedRole) {
        setError("The selected role does not match this account.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(dashboardForRole(userRole), { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                <Building2 size={30} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-4">School Management System</h1>
              <p className="text-sm text-slate-500 mt-1">Sign in to continue to your dashboard</p>
            </div>

            {error && (
              <div role="alert" className="mb-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="email" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
                <div className="relative">
                  <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
                    <option value="">Select your role</option>
                    <option value="admin">Principal / Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                  <ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <div className="relative min-h-56 md:min-h-[600px] w-full md:w-1/2">
          <img src={college} alt="College campus" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">One platform</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">Manage your school with confidence.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-blue-100">Students, teachers, classes, fees and attendance in one organized workspace.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
