import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentList from "./pages/StudentList";
import AddStudent from "./pages/AddStudent";
import TeacherList from "./pages/TeacherList";
import AddTeacher from "./pages/AddTeacher";
import ClassesList from "./pages/ClassesList";
import AddClass from "./pages/AddClass";
import SubjectList from "./pages/SubjectList";
import AddSubject from "./pages/AddSubject";
import FeesList from "./pages/FeesList";
import AddFee from "./pages/AddFee";
import TeacherDashboard from "./pages/TeacherDashboard";
import MyStudents from "./pages/MyStudents";
import MyClasses from "./pages/MyClasses";
import MarkAttendance from "./pages/MarkAttendance";
import MyProfile from "./pages/MyProfile";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import MyAttendance from "./pages/MyAttendance";
import MyFees from "./pages/MyFees";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute roles={["principal"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/add-teachers" element={<AddTeacher />} />
          <Route path="/classes" element={<ClassesList />} />
          <Route path="/add-class" element={<AddClass />} />
          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/fees" element={<FeesList />} />
          <Route path="/add-fee" element={<AddFee />} />
        </Route>

        <Route element={<ProtectedRoute roles={["teacher"]} />}>
          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="/my-students" element={<MyStudents />} />
          <Route path="/my-classes" element={<MyClasses />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Route>

        <Route element={<ProtectedRoute roles={["student"]} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/my-attendance" element={<MyAttendance />} />
          <Route path="/my-fees" element={<MyFees />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
