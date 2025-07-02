import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Paper, Typography, Box, TextField,
  Button, Avatar, Grid, Alert, CircularProgress,
} from '@mui/material';
import { storage } from '../../utils/storage';
import { api } from '../../utils/api';

const Profile = () => {
  const dispatch = useDispatch();
  // Fallback: get user from localStorage if Redux state is empty
  const reduxUser = useSelector(state => state.auth.user);
  const user = reduxUser || storage.getUser();
  const loading = useSelector(state => state.user.loading);
  const error = useSelector(state => state.user.error);

  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch({ type: 'user/setLoading', payload: true });
    dispatch({ type: 'user/clearError' });

    try {
      if (!formData.name || !formData.email) throw new Error('Name and email are required.');
      // Update user profile in backend
      const res = await api.put('/auth/me', formData);
      dispatch({ type: 'auth/setUser', payload: res.data });
      storage.setUser(res.data);
    } catch (err) {
      dispatch({ type: 'user/setError', payload: err.response?.data?.message || err.message });
    } finally {
      dispatch({ type: 'user/setLoading', payload: false });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Typography variant="h5">Your Profile</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={onChange}
                  disabled={loading}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={onChange}
                  disabled={loading}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
