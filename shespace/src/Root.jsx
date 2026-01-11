// src/Root.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login.jsx"; // correct path
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function Root() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Protected main app */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
