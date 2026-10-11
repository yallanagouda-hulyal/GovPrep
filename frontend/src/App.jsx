import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Exams from "./pages/Exams";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import Quiz from "./pages/Quiz";

import MockTests from "./pages/MockTests";
import MockTest from "./pages/MockTest";

import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import AdminLessons from "./pages/AdminLessons";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminUsers from "./pages/AdminUsers";



function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL NAVBAR */}
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* EXAMS */}
        <Route
          path="/exams"
          element={<Exams />}
        />

        {/* COURSES */}
        <Route
          path="/courses"
          element={<Courses />}
        />

        {/* COURSE DETAILS */}
        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />

        {/* LEARNING */}
        <Route
          path="/learning/:id"
          element={<Learning />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* COURSE QUIZ */}
        <Route
          path="/quiz/:id"
          element={<Quiz />}
        />

        {/* =================================
            MOCK TEST LIST
        ================================= */}
        <Route
          path="/mock-tests"
          element={<MockTests />}
        />

        {/* =================================
            MOCK TEST CBT
        ================================= */}
        <Route
          path="/mock-tests/:id"
          element={<MockTest />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/courses"
          element={<AdminCourses />}
        />

        <Route
          path="/admin/lessons"
          element={<AdminLessons />}
        />

        <Route
          path="/admin/quizzes"
          element={<AdminQuizzes />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;