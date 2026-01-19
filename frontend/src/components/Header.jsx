import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Popover,
  Badge,
  Button,
  Switch,
  useTheme,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeMode } from "../context/ThemeContext";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";


export default function Header() {
  const theme = useTheme();
  const navigator = useNavigate();
  const { darkMode, toggleDarkMode } = useThemeMode();
  const [user, setUser] = useState(null);
  // Avatar popover state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Notifications popover state
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const notifOpen = Boolean(notifAnchorEl);

  // Sample notifications
  const notifications = [
    "Over-budget alert: Food category",
    "Payment due: Electricity Bill",
    "Bill reminder: Internet subscription"
  ];

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleNotifClick = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleMenuAction = (action) => {
    handlePopoverClose();
    // navigator("/login");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigator("/login");
  };


  useEffect(() => {
    // Fetch user data on mount (example userId used here)
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userData = await getUserById(user.id);
        console.log("User Data:", userData.name);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: theme.palette.background.primary,
        color: theme.palette.text.primary,
        boxShadow: 1,
      }}
    >
      {/* Left side */}
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        Welcome, {user?.name} <HandshakeIcon sx={{ color: theme.palette.primary.main }} />
      </Typography>

      {/* Right side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        {/* Notifications */}
        <IconButton onClick={handleNotifClick} color="inherit">
          <Badge badgeContent={notifications.length} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <Popover
          open={notifOpen}
          anchorEl={notifAnchorEl}
          onClose={handleNotifClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography fontWeight={600}>Notifications</Typography>
            <List>
              {notifications.map((notif, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={notif} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>

        {/* User Avatar */}
        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
          <Avatar
            src={user?.profileImage || undefined}
            sx={{
              bgcolor: theme.palette.primary.main,
            }}
          >
            {!user?.profileImage && user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        {/* Avatar Popover */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, minWidth: 200 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography fontWeight={600}>{user?.name}</Typography>
            </Box>

            <Button variant="outlined" onClick={() => handleMenuAction("viewProfile")}>View Profile</Button>
            <Button variant="outlined" onClick={() => handleMenuAction("editProfile")}>Edit Profile</Button>
            <Button color="error" variant="outlined" onClick={logout}>Logout</Button>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography>Dark Mode</Typography>
              <Switch checked={darkMode} onChange={toggleDarkMode} />
            </Box>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
