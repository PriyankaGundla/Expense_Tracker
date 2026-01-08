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
import {
    Visibility,
    VisibilityOff,
    AccountCircle,
    Lock,
    Email,
} from "@mui/icons-material";
import TermsDialog from "./TermsAndConditions";

function Signup() {
    const theme = useTheme();

    const [openTerms, setOpenTerms] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, password, confirmPassword, agree });
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
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 1,
                            fontWeight: 700,
                            textAlign: "center",
                            color: theme.palette.primary.main,
                        }}
                    >
                        Create Account
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ mb: 3, textAlign: "center", color: theme.palette.text.secondary }}
                    >
                        Sign up to start tracking your expenses
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <TextField
                            fullWidth
                            label="Full Name"
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: "15px" },
                            }}
                        />

                        {/* Email */}
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: "15px" },
                            }}
                        />

                        {/* Password */}
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: "15px" },
                            }}
                        />

                        {/* Confirm Password */}
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: "15px" },
                            }}
                        />

                        {/* Terms */}
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Checkbox
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                />
                            }
                            label={
                                <Typography variant="body2" align="center">
                                    By signing up, you agree to our{" "}
                                    <span
                                        style={{ color: theme.palette.primary.main, cursor: "pointer" }}
                                        onClick={() => setOpenTerms(true)}
                                    >
                                        Terms & Conditions
                                    </span>
                                </Typography>

                            }
                        />

                        {/* Sign Up Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: "15px",
                                fontWeight: 600,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            }}
                        >
                            Sign Up
                        </Button>
                    </form>

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

                    {/* Login Redirect */}
                    <Typography
                        variant="body2"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        Already have an account?{" "}
                        <Link href="/login" underline="hover">
                            Login
                        </Link>
                    </Typography>
                </CardContent>
            </Card>

            <TermsDialog
                open={openTerms}
                onClose={() => setOpenTerms(false)}
            />
        </Box>


    );
}

export default Signup;



