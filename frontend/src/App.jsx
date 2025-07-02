import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';
import Contacts from './components/contacts/Contacts';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/routing/PrivateRoute';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { api } from './utils/api';
import { storage } from './utils/storage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = storage.getToken();
    if (token) {
      api.get('/auth/me')
        .then(res => {
          dispatch({ type: 'auth/setUser', payload: res.data });
          storage.setUser(res.data);
        })
        .catch(() => {
          // Optionally handle error (e.g., invalid token)
        });
    }
  }, [dispatch]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<PrivateRoute><Contacts /></PrivateRoute>} />
              <Route path="contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
              <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
