import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BlogGenerator from "./components/BlogGenerator";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <BlogGenerator />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
