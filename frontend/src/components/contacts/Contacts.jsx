import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Alert,
  CircularProgress,
  Slide,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Contacts as ContactsIcon
} from '@mui/icons-material';
import { api } from '../../utils/api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState('add');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'personal'
  });

  const { name, email, phone, category } = formData;
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // Fetch contacts from backend
    setLoading(true);
    api.get('/contacts')
      .then(res => setContacts(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch contacts'))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (type = 'add', contact = null) => {
    setFormType(type);
    setFormData(
      contact || { name: '', email: '', phone: '', category: 'personal' }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', email: '', phone: '', category: 'personal' });
  };

  const validateForm = () => {
    const errors = [];
    if (!name) errors.push('Name is required');
    if (!email) errors.push('Email is required');
    if (!phone) errors.push('Phone number is required');
    if (!category) errors.push('Category is required');
    if (errors.length > 0) throw new Error(errors.join('\n'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      validateForm();
      if (formType === 'add') {
        const res = await api.post('/contacts', formData);
        setContacts([...contacts, res.data]);
        setSuccess('Contact added successfully');
      } else {
        const res = await api.put(`/contacts/${formData._id}`, formData);
        setContacts(contacts.map(c => c._id === formData._id ? res.data : c));
        setSuccess('Contact updated successfully');
      }
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setLoading(true);
      try {
        await api.delete(`/contacts/${contactId}`);
        setContacts(contacts.filter(c => c._id !== contactId));
        setSuccess('Contact deleted successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete contact');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Fade in timeout={500}>
        <Paper elevation={6} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap'
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                <ContactsIcon sx={{ mb: '-5px', mr: 1 }} color="primary" />
                Welcome {user?.name || user?.email || 'User'} 👋
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Here's your personal contact list. Manage them easily!
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: { xs: 2, md: 0 } }}
              startIcon={<AddIcon />}
              onClick={() => handleOpen('add')}
            >
              Add New Contact
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {contacts.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
              No contacts found. Start by adding one!
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map(contact => (
                    <TableRow key={contact._id}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.category}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen('edit', contact)}
                          disabled={loading}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(contact._id)}
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Fade>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{formType === 'add' ? 'Add Contact' : 'Edit Contact'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={loading}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                disabled={loading}
                SelectProps={{ native: true }}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="family">Family</option>
                <option value="other">Other</option>
              </TextField>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : formType === 'add' ? 'Add' : 'Update'}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Contacts;
