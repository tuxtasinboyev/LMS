import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Verifys from './pages/Verify-phone';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Courses from './pages/Courses';
import AboutUs from './pages/AboutUs';
import { Contact } from './utils/helper';
import Contacts from './pages/Contact';
import CoursesAdd from './pages/CoursesAdd';
import MentorHome from './pages/Mentor/Home';

function App() {
  return (
    <div>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verifys />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/corsesInfo" element={<CoursesAdd />} />
        <Route path="/mentorHome" element={<MentorHome />} />
      </Routes>
    </div>
  );
}

export default App;
