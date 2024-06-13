import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import '../src/assets/navBar.css'

function NavBar() {
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [isInstructorLoggedIn, setIsInstructorLoggedIn] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const checkStudentLoginStatus = async () => {
      try {
        const res = await axios.get('/api/check-student-session');
        if (res.data.studentLoggedIn) {
          setIsStudentLoggedIn(true);
        } else {
          setIsStudentLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkStudentLoginStatus();
  }, []);

  useEffect(() => {
    const checkInstructorLoginStatus = async () => {
      try {
        const res = await axios.get('/api/check-instructor-session');
        if (res.data.instructorLoggedIn) {
          setIsInstructorLoggedIn(true);
        } else {
          setIsInstructorLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkInstructorLoginStatus();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/logout');
      if (res.data.success) {
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      
        <NavLink className="navbar-brand" to="/">LineUp</NavLink>
        
          <ul className="navbar-ul">
            <li className="nav-item">
              <NavLink className="nav-link" to="/resorts">view resorts</NavLink>
            </li>
            {!isInstructorLoggedIn && !isStudentLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Log in</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/student-login">Student Log in</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">Sign up</NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/lessons">Lesson up</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/students">Student up</NavLink>
            </li>
          </ul>
          {isStudentLoggedIn && (
            <ul className="logged-in-btn">
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
              </li>
              <li className='nav-item'>
               
                <NavLink 
                 className="nav-item"
                 to="/me-student"><button>your profile</button>
                 </NavLink>
              </li>
            </ul>
          )}
          {isInstructorLoggedIn && (
            <ul className="logged-in-btn">
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
              </li>
              <li className='nav-item'>
               
                <NavLink 
                 className="nav-item"
                 to="/me"><button>your profile</button>
                 </NavLink>
              </li>
            </ul>
          )}
       
     
    </nav>
  );
}

export default NavBar;
