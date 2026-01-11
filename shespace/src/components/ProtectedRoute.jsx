// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("shespace_logged_in") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
