import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";


export default function Home({ darkMode, toggleDarkMode }) {
  return (
    <div>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main style={{ padding: "2rem" }}>
        <h2>Welcome to Expense Tracker</h2>
      </main>
      <Outlet />
    </div>
  );
}
