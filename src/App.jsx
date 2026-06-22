import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BlogGenerator from "./components/BlogGenerator";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

export default function App() {
  // Simple check for mock authentication
  const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/" 
          element={isAuthenticated() ? <BlogGenerator /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
