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
import { Visibility, VisibilityOff, AccountCircle, Lock, Email, Work } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TermsDialog from "./TermsAndConditions";
import { createUser } from "../services/userService";

function Signup() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [openTerms, setOpenTerms] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    designation: "",
    password: "",
    confirmPassword: "",
    agree: "",
  });

  // -------------------- Validators --------------------
  const validators = {
    name: (value) => {
      if (!value.trim()) return "Full Name is required";
      if (!/^[A-Za-z ]+$/.test(value)) return "Name can contain only letters and spaces";
      if (value.trim().length < 3 || value.trim().length > 50) return "Name must be 3-50 characters";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
      return "";
    },
    designation: (value) => {
      if (!value.trim()) return "Designation is required";
      if (!/^[A-Za-z ]+$/.test(value)) return "Designation can contain only letters and spaces";
      if (value.trim().length < 2 || value.trim().length > 50) return "Designation must be 2-50 characters";
      return "";
    },
    password: (value) => {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/(?=.*[a-z])/.test(value)) return "Password must contain a lowercase letter";
      if (!/(?=.*[A-Z])/.test(value)) return "Password must contain an uppercase letter";
      if (!/(?=.*\d)/.test(value)) return "Password must contain a number";
      if (!/(?=.*[@$!%*?&])/.test(value)) return "Password must contain a special character";
      return "";
    },
    confirmPassword: (value, form) => {
      if (!value) return "Confirm Password is required";
      if (value !== form.password) return "Passwords do not match";
      return "";
    },
    agree: (value) => {
      if (!value) return "You must accept the Terms & Conditions";
      return "";
    },
  };

  // -------------------- Generic Change Handler --------------------
  const handleChange = (field) => (e) => {
    const value = field === "agree" ? e.target.checked : e.target.value;

    // Update form state
    setForm((prev) => ({ ...prev, [field]: value }));

    // Update errors dynamically
    setErrors((prev) => ({
      ...prev,
      [field]: field === "confirmPassword"
        ? validators.confirmPassword(value, { ...form, [field]: value })
        : validators[field](value),
    }));

    // If password changes, re-validate confirmPassword
    if (field === "password" && form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validators.confirmPassword(form.confirmPassword, { ...form, password: value }),
      }));
    }
  };

  // -------------------- Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    const validationErrors = {};
    Object.keys(form).forEach((key) => {
      validationErrors[key] =
        key === "confirmPassword"
          ? validators.confirmPassword(form[key], form)
          : validators[key](form[key]);
    });

    setErrors(validationErrors);

    const hasError = Object.values(validationErrors).some((err) => err);
    if (hasError) return;

    const user = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      designation: form.designation.trim(),
      password: form.password,
      acceptedTerms: form.agree,
    };

    try {
      const res = await createUser(user);
      navigate("/login");

    } catch (err) {
      console.error(err);
    }
  };


  // -------------------- Render --------------------
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
      <Card sx={{ padding: "1%", width: 500, borderRadius: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.3)", backgroundColor: theme.palette.background.paper }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, textAlign: "center", color: theme.palette.primary.main }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: theme.palette.text.secondary }}>
            Sign up to start tracking your expenses
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={form.name}
              onChange={handleChange("name")}
              helperText={errors.name}
              FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>, sx: { borderRadius: "15px" } }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={handleChange("email")}
              helperText={errors.email}
              FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment>, sx: { borderRadius: "15px" } }}
            />

            {/* Designation */}
            <TextField
              fullWidth
              label="Designation"
              margin="normal"
              value={form.designation}
              onChange={handleChange("designation")}
              helperText={errors.designation}
              FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Work /></InputAdornment>, sx: { borderRadius: "15px" } }}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={form.password}
              onChange={handleChange("password")}
              helperText={errors.password}
              FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment>,
                sx: { borderRadius: "15px" },
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              helperText={errors.confirmPassword}
              FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment>,
                sx: { borderRadius: "15px" },
              }}
            />

            {/* Terms */}
            <FormControlLabel
              sx={{ mt: 1 }}
              control={<Checkbox checked={form.agree} onChange={handleChange("agree")} />}
              label={
                <Typography variant="body2">
                  By signing up, you agree to our{" "}
                  <span style={{ color: theme.palette.primary.main, cursor: "pointer" }} onClick={() => setOpenTerms(true)}>
                    Terms & Conditions
                  </span>
                </Typography>
              }
            />
            {errors.agree && <Typography variant="caption" color="error" sx={{ display: "block", ml: 1 }}>{errors.agree}</Typography>}

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: "15px",
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
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
            <Typography sx={{ mx: 2, color: "#888", fontWeight: 500 }}>
              OR
            </Typography>
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
              src="/public/google-logo.png"
              sx={{ width: 40, height: 20, }}
            />
            Continue with Google
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }} >
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <TermsDialog open={openTerms} onClose={() => setOpenTerms(false)} />
    </Box>
  );
}

export default Signup;
