import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Contacts as ContactsIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    
    navigate(path);
    handleClose();
  };

  const authLinks = (
    <Box>
      <Button
        onClick={() => navigate('/contacts')}
        color="inherit"
        startIcon={<ContactsIcon />}
        sx={{
          mr: 2,
          '&:hover': {
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          },
        }}
      >
        Contacts
      </Button>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => handleNavigate('/contacts')}
          sx={{
            '&:hover': {
              bgcolor: 'primary.light',
            },
          }}
        >
          <ContactsIcon sx={{ mr: 1 }} /> My Contacts
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigate('/profile')}
          sx={{
            '&:hover': {
              bgcolor: 'primary.light',
            },
          }}
        >
          <AccountIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigate('/logout')}
          sx={{
            '&:hover': {
              bgcolor: 'error.light',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>
    </Box>
  );

  const guestLinks = (
    <Box>
      <Button
        onClick={() => navigate('/login')}
        color="inherit"
        startIcon={<LoginIcon />}
        sx={{
          mr: 2,
          '&:hover': {
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          },
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => navigate('/register')}
        color="inherit"
        startIcon={<RegisterIcon />}
        sx={{
          '&:hover': {
            bgcolor: 'secondary.light',
            color: 'secondary.contrastText',
          },
        }}
      >
        Register
      </Button>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <Typography
          onClick={() => navigate('/')} 
          variant="h6"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.light',
            },
          }}
        >
          Contact Book
        </Typography>
        {isAuthenticated ? authLinks : guestLinks}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
