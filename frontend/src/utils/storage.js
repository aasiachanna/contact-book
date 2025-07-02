const USER_KEY = 'contact-book-user';
const TOKEN_KEY = 'contact-book-token';
const CONTACTS_KEY = 'contact-book-contacts';

export const storage = {
  // 🔐 User-related
  setUser: (userData) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error('Error saving user data:', err);
      return false;
    }
  },

  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error getting user data:', err);
      return null;
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return true;
    } catch (err) {
      console.error('Error removing user data:', err);
      return false;
    }
  },

  // 🔑 Token-related
  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      return true;
    } catch (err) {
      console.error('Error saving token:', err);
      return false;
    }
  },

  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.error('Error removing token:', err);
    }
  },

  // 📇 Contacts-related (scoped by user email)
  setContacts: (contacts) => {
    try {
      const user = storage.getUser();
      if (!user?.email) throw new Error('No user email found');
      const allContacts = storage.getAllContacts();
      allContacts[user.email] = contacts;
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(allContacts));
      return true;
    } catch (err) {
      console.error('Error saving contacts:', err);
      return false;
    }
  },

  getContacts: () => {
    try {
      const user = storage.getUser();
      const allContacts = storage.getAllContacts();
      return user?.email && allContacts[user.email] ? allContacts[user.email] : [];
    } catch (err) {
      console.error('Error getting contacts:', err);
      return [];
    }
  },

  getAllContacts: () => {
    try {
      const data = localStorage.getItem(CONTACTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (err) {
      console.error('Error reading all contacts:', err);
      return {};
    }
  },

  addContact: (contact) => {
    try {
      const contacts = storage.getContacts();
      contacts.push(contact);
      return storage.setContacts(contacts);
    } catch (err) {
      console.error('Error adding contact:', err);
      return false;
    }
  },

  updateContact: (updatedContact) => {
    try {
      const contacts = storage.getContacts();
      const index = contacts.findIndex(c => c._id === updatedContact._id);
      if (index !== -1) {
        contacts[index] = updatedContact;
        return storage.setContacts(contacts);
      }
      return false;
    } catch (err) {
      console.error('Error updating contact:', err);
      return false;
    }
  },

  deleteContact: (contactId) => {
    try {
      const contacts = storage.getContacts();
      const updatedContacts = contacts.filter(c => c._id !== contactId);
      return storage.setContacts(updatedContacts);
    } catch (err) {
      console.error('Error deleting contact:', err);
      return false;
    }
  }
};
