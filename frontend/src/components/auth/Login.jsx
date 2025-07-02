import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { errorHandler } from '../../utils/errorHandler';
import { api } from '../../utils/api';
import {
  Container,
  Paper,
  TextField,
  Button, 
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { storage } from '../../utils/storage'; // Import the storage utility

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/contacts" replace />;
  }

  const { email, password } = formData;

  const validateForm = () => {
    const errors = [];
    
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      validateForm();
      
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });
      
      dispatch({ type: 'auth/setAuthToken', payload: res.data.token });
      storage.setToken(res.data.token); // Ensure token is saved in localStorage
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for localStorage sync
      try {
        const userRes = await api.get('/auth/me');
        console.log('Fetched user profile:', userRes.data);
        dispatch({ type: 'auth/setUser', payload: userRes.data });
      } catch (userErr) {
        console.error('Failed to fetch user profile:', userErr);
        setError('Failed to fetch user profile.');
      }
      
      navigate('/contacts');
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  const emailError = Boolean(error && !email);
  const passwordError = Boolean(error && !password);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Sign in to continue to Contact Book
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.split('\n').map((msg, index) => (
                <React.Fragment key={index}>
                  {msg}
                  {index < error.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </Alert>
          )}

          <form onSubmit={onSubmit} ref={formRef}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
              error={emailError}
              helperText={emailError ? 'Please enter your email address' : ''}
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'error.main',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
              error={passwordError}
              helperText={passwordError ? 'Please enter your password' : ''}
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'error.main',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" />
                  <span style={{ marginLeft: 8 }}>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => navigate('/register')}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
