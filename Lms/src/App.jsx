import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/studentDashboard";
import StudentAttendance from "./pages/StudentAttendance";
import Calender from "./pages/Calender";
import Chat from "./components/chat";
import Profile from "./pages/Profile";
import Assignments from "./pages/Assignments";
import SemesterAttendance from "./pages/SemesterAttendance";
import Feedback from "./pages/Feedback";
import ApplyLeave from "./pages/ApplyLeave";
import WeeklySubjectFeedback from "./pages/WeeklySubjectFeedback";
import Events from "./pages/Events";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/attendance" element={<StudentAttendance />} />
      <Route path="/student/calendar" element={<Calender />} />
      <Route path="/student/chat" element={<Chat />} />
      <Route path="/student/profile" element={<Profile />} />
      <Route path="/student/assignments" element={<Assignments />} />
      <Route
        path="/student/semester-attendance"
        element={<SemesterAttendance />}
      />
      <Route path="/student/feedback" element={<Feedback />} />
      <Route path="/student/apply-leave" element={<ApplyLeave />} />
      <Route path="/student/events" element={<Events />} />
      <Route
        path="/student/weekly-subject-feedback"
        element={<WeeklySubjectFeedback />}
      />
    </Routes>
  );
}

export default App;
