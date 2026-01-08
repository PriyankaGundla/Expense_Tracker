import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../components/Dashboard";
import ExpensePage from "../pages/ExpensePage";
import Layout from "../layouts/ Layout";
import Category from "../pages/CategoryPage";

//const isAuthenticated = () => !!localStorage.getItem("token");

const isAuthenticated = () => true;

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (NO Sidebar / Header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (WITH Sidebar & Header) */}
        <Route
          element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/category" element={<Category />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
