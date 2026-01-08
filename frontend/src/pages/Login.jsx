import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Link,
    useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


function Login() {
    const theme = useTheme(); // Access current theme
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", { email, password, rememberMe });
        console.log("dashboard")
        navigate("/dashboard");

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: theme.palette.background.default,
            }}
        >
            <Card
                sx={{
                    padding: "1%",

                    width: 500,
                    borderRadius: 3,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(10px)",
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: 700,
                            textAlign: "center",
                            color: theme.palette.primary.main,
                        }}
                    >
                        Expense Tracker
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ mb: 2, textAlign: "center", color: theme.palette.text.primary }}
                    >
                        Login to manage your expenses
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {/* Email / Username */}
                        <TextField
                            fullWidth
                            type="email"
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle color="action" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: "15px",
                                },
                            }}
                        />

                        {/* Password */}
                        <TextField
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: "15px",
                                },
                            }}
                        />

                        {/* Remember Me + Forgot Password */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 1,
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Remember Me"
                            />
                            <Link
                                href="#"
                                underline="hover"
                                sx={{ fontSize: 14, color: theme.palette.primary.main }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                fontWeight: 600,
                                borderRadius: "15px",
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                "&:hover": {
                                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                                },
                            }}
                        >
                            Login
                        </Button>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                my: 2,
                            }}
                        >
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
                            <Typography sx={{ mx: 2, color: "#888", fontWeight: 500 }}>OR</Typography>
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
                        </Box>

                        <Button
                            variant="outlined"
                            fullWidth
                            // onClick={handleGoogleLogin}
                            sx={{
                                py: 1.5,
                                borderRadius: "15px",
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.text.primary,
                                textTransform: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,

                            }}
                        >
                            <Box
                                component="img"
                                src="/public/google-logo.png"   // change extension if svg
                                alt="Google"
                                sx={{
                                    width: 40,
                                    height: 20,
                                }}
                            />
                            Continue with Google
                        </Button>


                    </form>

                    <Typography
                        variant="body2"
                        sx={{ mt: 2, textAlign: "center", color: theme.palette.text.primary }}
                    >
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            style={{
                                color: theme.palette.primary.main,
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            Sign Up
                        </span>
                    </Typography>

                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
