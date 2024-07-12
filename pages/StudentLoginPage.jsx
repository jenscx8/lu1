import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import StudentLoginForm from '../forms/StudentLoginForm'

export default function StudentLoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (event, formData) => {
    event.preventDefault();

    const res = await axios.post('/api/students/student-auth', formData);

    if (res.data.success) {
      navigate('/student-dashboard');
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <StudentLoginForm onLogin={handleLogin} />
    </>
  );
}

// style this better