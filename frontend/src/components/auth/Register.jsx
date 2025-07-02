import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { storage } from "../../utils/storage";
import { api } from "../../utils/api";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/contacts" replace />;
  }

  const { name, email, password, password2 } = formData;

  const validateForm = () => {
    const errors = [];

    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (!password2) errors.push("Confirm password is required");
    if (password !== password2) errors.push("Passwords do not match");
    if (password.length < 6)
      errors.push("Password must be at least 6 characters");

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "user/clearError" });
    dispatch({ type: "user/setLoading", payload: true });

    try {
      validateForm();

      // Make API call to backend for registration
      const res = await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        password2,
      });

      // Store the token in Redux and localStorage
      dispatch({ type: "auth/setAuthToken", payload: res.data.token });
      storage.setToken(res.data.token);
      // Fetch user profile from backend to get _id
      await new Promise((resolve) => setTimeout(resolve, 150));
      try {
        const userRes = await api.get("/auth/me");
        dispatch({ type: "auth/setUser", payload: userRes.data });
        storage.setUser(userRes.data);
      } catch (userErr) {
        dispatch({ type: "auth/setUser", payload: { name, email } });
        storage.setUser({ name, email });
      }
      navigate("/contacts");
    } catch (err) {
      dispatch({
        type: "user/setError",
        payload: err.response?.data?.message || err.message,
      });
    } finally {
      dispatch({ type: "user/setLoading", payload: false });
    }
  };

  const nameError = Boolean(error && error.includes("Name is required"));
  const emailError = Boolean(error && error.includes("Email is required"));
  const passwordError = Boolean(
    error && error.includes("Password is required")
  );
  const password2Error = Boolean(
    error && error.includes("Passwords do not match")
  );

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Register
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={onSubmit}
            ref={formRef}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={onChange}
              error={nameError}
              helperText={nameError && "Name is required"}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={onChange}
              error={emailError}
              helperText={emailError && "Email is required"}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={onChange}
              error={passwordError}
              helperText={passwordError && "Password is required"}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              autoComplete="new-password"
              value={password2}
              onChange={onChange}
              error={password2Error}
              helperText={password2Error && "Passwords do not match"}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link href="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
