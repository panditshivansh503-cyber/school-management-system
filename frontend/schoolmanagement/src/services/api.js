const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const getHeaders = (isJson = true) => {
  const headers = { Accept: "application/json" };
  if (isJson) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : {};

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: options.headers || getHeaders(options.body !== undefined),
    });
    return handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to the server. Please make sure the backend is running.", { cause: error });
    }
    throw error;
  }
};

const queryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : "";
};

export const api = {
  getBaseUrl: () => API_BASE_URL,

  login: (email, password) => request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  }),

  getMe: () => request("/auth/me", { headers: getHeaders(false) }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getStudents: (params = {}) => request(`/students${queryString(params)}`, { headers: getHeaders(false) }),
  getStudentById: (id) => request(`/students/${encodeURIComponent(id)}`, { headers: getHeaders(false) }),
  getStudentByEmail: (email) => request(`/students/email/${encodeURIComponent(email)}`, { headers: getHeaders(false) }),
  addStudent: (data) => request("/students", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/students/${encodeURIComponent(id)}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/students/${encodeURIComponent(id)}`, { method: "DELETE", headers: getHeaders(false) }),

  getTeachers: (params = {}) => request(`/teachers${queryString(params)}`, { headers: getHeaders(false) }),
  getTeacherById: (id) => request(`/teachers/${encodeURIComponent(id)}`, { headers: getHeaders(false) }),
  getTeacherByEmail: (email) => request(`/teachers/email/${encodeURIComponent(email)}`, { headers: getHeaders(false) }),
  addTeacher: (data) => request("/teachers", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }),
  updateTeacher: (id, data) => request(`/teachers/${encodeURIComponent(id)}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),
  deleteTeacher: (id) => request(`/teachers/${encodeURIComponent(id)}`, { method: "DELETE", headers: getHeaders(false) }),

  getClasses: (params = {}) => request(`/classes${queryString(params)}`, { headers: getHeaders(false) }),
  getClassById: (id) => request(`/classes/${encodeURIComponent(id)}`, { headers: getHeaders(false) }),
  addClass: (data) => request("/classes", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }),
  updateClass: (id, data) => request(`/classes/${encodeURIComponent(id)}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),
  deleteClass: (id) => request(`/classes/${encodeURIComponent(id)}`, { method: "DELETE", headers: getHeaders(false) }),

  getSubjects: (params = {}) => request(`/subjects${queryString(params)}`, { headers: getHeaders(false) }),
  getSubjectById: (id) => request(`/subjects/${encodeURIComponent(id)}`, { headers: getHeaders(false) }),
  addSubject: (data) => request("/subjects", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }),
  updateSubject: (id, data) => request(`/subjects/${encodeURIComponent(id)}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),
  deleteSubject: (id) => request(`/subjects/${encodeURIComponent(id)}`, { method: "DELETE", headers: getHeaders(false) }),

  getFees: (params = {}) => request(`/fees${queryString(params)}`, { headers: getHeaders(false) }),
  getFeeById: (id) => request(`/fees/${encodeURIComponent(id)}`, { headers: getHeaders(false) }),
  addFee: (data) => request("/fees", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }),
  updateFee: (id, data) => request(`/fees/${encodeURIComponent(id)}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),
  getFeesByStudent: (studentId) => request(`/fees/student/${encodeURIComponent(studentId)}`, { headers: getHeaders(false) }),
  deleteFee: (id) => request(`/fees/${encodeURIComponent(id)}`, { method: "DELETE", headers: getHeaders(false) }),

  markAttendance: (data) => request("/attendance", { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }),
  getStudentsForAttendance: (params = {}) => request(`/attendance/students${queryString(params)}`, { headers: getHeaders(false) }),
  getAttendanceByStudent: (studentId, params = {}) => request(`/attendance/student/${encodeURIComponent(studentId)}${queryString(params)}`, { headers: getHeaders(false) }),
  getAttendanceByClass: (className, section, params = {}) => request(`/attendance/class/${encodeURIComponent(className)}/${encodeURIComponent(section || "all")}${queryString(params)}`, { headers: getHeaders(false) }),

  getTeacherProfile: (email) => request(`/profile/teacher/${encodeURIComponent(email)}`, { headers: getHeaders(false) }),
  updateTeacherProfile: (email, data) => request(`/profile/teacher/${encodeURIComponent(email)}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),
  getStudentProfile: (email) => request(`/profile/student/${encodeURIComponent(email)}`, { headers: getHeaders(false) }),
  updateStudentProfile: (email, data) => request(`/profile/student/${encodeURIComponent(email)}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),

  getAdminDashboard: () => request("/dashboard/admin", { headers: getHeaders(false) }),
  getTeacherDashboard: (email) => request(`/dashboard/teacher/${encodeURIComponent(email)}`, { headers: getHeaders(false) }),
  getStudentDashboard: (email) => request(`/dashboard/student/${encodeURIComponent(email)}`, { headers: getHeaders(false) }),
};

export default api;
