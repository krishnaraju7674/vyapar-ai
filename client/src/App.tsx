import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ResetPassword from "./pages/ResetPassword";
import DemoPage from "./pages/Demo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home apiUrl={API_URL} />} />
          <Route path="/dashboard/:id" element={<Dashboard apiUrl={API_URL} />} />
          <Route path="/history" element={<History apiUrl={API_URL} />} />
          <Route path="/reset-password/:token" element={<ResetPassword apiUrl={API_URL} />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
