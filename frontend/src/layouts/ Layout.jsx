import { Box } from "@mui/material";
import Sidebar from "../components/ Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function Layout({ darkMode, toggleDarkMode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
