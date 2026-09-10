import { LayoutDashboard, Users, UserRound, BookOpen, ClipboardList, IndianRupee, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminAside({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const menu = [
    [LayoutDashboard, "Dashboard", "/admin-dashboard"],
    [Users, "Students", "/students"],
    [UserRound, "Teachers", "/teachers"],
    [BookOpen, "Classes", "/classes"],
    [ClipboardList, "Subjects", "/subjects"],
    [IndianRupee, "Fees", "/fees"],
  ];

  const handleLogout = () => { api.logout(); navigate("/", { replace: true }); };

  return (
    <>
      {!collapsed && <div onClick={() => setCollapsed(true)} className="fixed inset-0 z-40 bg-black/40 md:hidden" aria-hidden="true" />}
      <aside className={`fixed md:sticky md:top-0 md:self-start top-0 left-0 h-screen z-50 bg-blue-950 text-white transition-all duration-300 shadow-xl ${collapsed ? "w-16 -translate-x-full md:translate-x-0" : "w-56 translate-x-0"}`}>
        <div className="h-16 px-4 flex items-center justify-between border-b border-blue-900">
          {!collapsed && <span className="font-bold whitespace-nowrap">School Management</span>}
          <button aria-label={collapsed ? "Open sidebar" : "Close sidebar"} onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        <nav className="p-3 space-y-1" aria-label="Admin navigation">
          {menu.map(([Icon, name, path]) => {
            const active = location.pathname === path;
            return <Link to={path} key={name} title={collapsed ? name : undefined} onClick={() => { if (window.innerWidth < 768) setCollapsed(true); }} className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${active ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-900"}`}>
              <Icon size={18} className="shrink-0" />{!collapsed && <span className="whitespace-nowrap">{name}</span>}
            </Link>;
          })}
          <button onClick={handleLogout} title={collapsed ? "Logout" : undefined} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-red-300 hover:bg-red-900/50 hover:text-red-100 transition-colors">
            <LogOut size={18} className="shrink-0" />{!collapsed && <span>Logout</span>}
          </button>
        </nav>
        {!collapsed && user?.name && <div className="absolute bottom-0 left-0 right-0 border-t border-blue-900 p-4"><p className="text-xs text-blue-300">Signed in as</p><p className="mt-1 truncate text-sm font-semibold">{user.name}</p></div>}
      </aside>
    </>
  );
}
export default AdminAside;
