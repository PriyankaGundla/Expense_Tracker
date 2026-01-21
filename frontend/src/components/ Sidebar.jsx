import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CategoryIcon from "@mui/icons-material/Category";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";

const drawerWidth = 300;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Expenses", icon: <ReceiptIcon />, path: "/expenses" },
  { text: "Category", icon: <CategoryIcon />, path: "/category" },
];

function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data on mount (example userId used here)
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userData = await getUserById(user.id);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.primary,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          color="primary"
          textAlign="center"
        >
          Expense Tracker
        </Typography>
      </Box>

      {/* User Profile */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          src={user?.profileImage || undefined}
          sx={{
            width: 100,
            height: 100,
            bgcolor: theme.palette.primary.main,
            fontSize: 40,
          }}
        >
          {!user?.profileImage && user?.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="text.primary"
        >
          {user ? user.name : "Loading..."}
        </Typography>
      </Box>

      <Divider />

      {/* App Name */}


      {/* Menu Items */}
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActive
                    ? `${theme.palette.primary.main}20`
                    : "transparent",
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}30`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: "text.primary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;
