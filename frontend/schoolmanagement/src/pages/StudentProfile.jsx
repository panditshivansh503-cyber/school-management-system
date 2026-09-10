import { useState, useEffect } from "react";
import StudentAside from "../components/StudentAside";
import {
  Menu,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  UserRound,
  Pencil,
  BookOpen,
  CalendarDays,
  Loader2,
  Save,
  X as XIcon,
} from "lucide-react";
import api from "../services/api";

function StudentProfile() {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"Student","email":""}');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (currentUser.email) {
        const data = await api.getStudentProfile(currentUser.email);
        if (data.success && data.profile) {
          setProfile(data.profile);
          setFormData(data.profile);
        }
      }
    } catch (err) {
      console.error("Failed to load student profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchProfile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const res = await api.updateStudentProfile(currentUser.email, formData);
      if (res.success) {
        setProfile(res.profile);
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (storedUser) {
          const nextUser = { ...storedUser, name: res.profile?.studentName || storedUser.name, email: res.profile?.email || storedUser.email };
          localStorage.setItem("user", JSON.stringify(nextUser));
        }
        setIsEditing(false);
        setMessage("Profile updated successfully!");
      }
    } catch (err) {
      setError(err.message || "Failed to update student profile");
    } finally {
      setSaving(false);
    }
  };

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
              My Profile
            </h1>
          </div>

          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold uppercase">
            {profile?.studentName ? profile.studentName[0] : "S"}
          </div>
        </header>

        {/* Profile */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <Loader2 className="animate-spin text-blue-700" size={32} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="bg-blue-700 p-6 text-white flex flex-col sm:flex-row items-center gap-5">
                <div className="w-24 h-24 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-3xl shadow">
                  {profile?.studentName ? profile.studentName[0] : <UserRound size={45} />}
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">
                    {profile?.studentName || currentUser.name}
                  </h2>
                  <p className="text-blue-100">
                    {profile?.className || "Class"} - Section {profile?.section || "A"}
                  </p>
                  <p className="text-sm text-blue-200 mt-1">
                    Admission No: {profile?.admissionNo || "N/A"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 sm:p-6">
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

                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-800">
                    Student Information
                  </h2>

                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-blue-600 text-sm hover:text-blue-800 font-medium"
                  >
                    {isEditing ? <XIcon size={16} /> : <Pencil size={16} />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Student Name</label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Father's Name</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Roll Number</label>
                      <input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm flex items-center gap-2"
                      >
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        <Save size={16} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <User className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="font-medium">{profile?.studentName || currentUser.name}</p>
                      </div>
                    </div>

                    {/* Father */}
                    <div className="flex items-center gap-3">
                      <UserRound className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Father Name</p>
                        <p className="font-medium">{profile?.fatherName || "N/A"}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{profile?.email || currentUser.email || "N/A"}</p>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center gap-3">
                      <Phone className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Mobile</p>
                        <p className="font-medium">{profile?.mobile || "N/A"}</p>
                      </div>
                    </div>

                    {/* Class */}
                    <div className="flex items-center gap-3">
                      <GraduationCap className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Class</p>
                        <p className="font-medium">{profile?.className} - {profile?.section}</p>
                      </div>
                    </div>

                    {/* Roll */}
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Roll Number</p>
                        <p className="font-medium">{profile?.rollNumber || "N/A"}</p>
                      </div>
                    </div>

                    {/* DOB */}
                    <div className="flex items-center gap-3">
                      <CalendarDays className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <MapPin className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-medium">
                          {profile?.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentProfile;