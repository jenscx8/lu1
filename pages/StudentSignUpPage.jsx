import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentSignUpForm from '../forms/StudentSignUpForm'

export default function SignUpPage() {
  const navigate = useNavigate();

  const handleStudentSignUp = async (event, formData) => {
    event.preventDefault();

    const res = await axios.post('/api/students/create', formData);

    navigate('/')
  };

  return (
    <>
      <hr></hr>
      <h1>student sign up</h1>
      <StudentSignUpForm onSignup={handleStudentSignUp} />
    </>
  );
}
