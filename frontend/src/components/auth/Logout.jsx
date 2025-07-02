import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { clearAuthToken } from "../../store/authSlice";
import { storage } from '../../utils/storage';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    storage.removeUser();
    dispatch(clearAuthToken());
  }, [dispatch]);

  return <Navigate to="/login" replace />;
};

export default Logout;
