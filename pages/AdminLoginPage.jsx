import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import AdminLoginForm from '../forms/AdminLoginForm'

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (event, formData) => {
    event.preventDefault();

    const res = await axios.post('/api/admin/login', formData);

    if (res.data.success) {
      navigate('/');
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <AdminLoginForm onLogin={handleLogin} />
    </>
  );
}

// style this better