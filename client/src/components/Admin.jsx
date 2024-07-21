import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import
import { useNavigate } from 'react-router-dom';
import logo from './dealsdray_logo.jpeg';
import mobile from './mobile.jpg';
import { useUser } from './Usercontext'; // Ensure correct import
import './Admin.css';

const Admin = ({ showCreateEmployee = true, showmobile = true }) => {
  const { user, setUser } = useUser(); // Use single user
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear token on logout
    navigate('/'); // Redirect to login
  };

  const create = () => {
    navigate('/employee'); // Navigate to employee creation
  };

  const employee = () => {
    navigate('/employee_list'); // Navigate to employee list
  };

  const home = () => {
    navigate('/admin');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/'); 
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        // Token has expired
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setUser(decodedToken); // Set user in context
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token'); // Remove invalid token
      navigate('/login'); // Redirect to login if token is invalid
    }
  }, [navigate, setUser]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <header className="dashboard-header">
        <img src={logo} alt="Company Logo" className="logo" />
        <div className="header-left">
          <h3 className="nav-link" onClick={home}>Home</h3>
          <h3 className="nav-link" onClick={employee}>Employee List</h3>
          {showCreateEmployee && (
            <h3 className="nav-link" onClick={create}>Create Employee</h3>
          )}
        </div>
        <div className="header-right">
          <h3>Welcome, {user.username}</h3>
          <h3 className="nav-link" onClick={logout}>Logout</h3>
        </div>
      </header>
      {showmobile &&
        <div className="static-content">
          <h2>Careers</h2>
          <h1>Join the DealsDray Team</h1>
          <p>Welcome to the DealsDray careers page. We're thrilled that you're considering joining our team of talented individuals who are passionate about making a real impact in the world of deals and e-commerce. If you're looking for a challenging and rewarding career opportunity, you've come to the right place.</p>
          <h3>Explore Talent, Flexible Opportunities.</h3>
          <p>India's Unique Mobile App</p>
          <img src={mobile} />
        </div>
      }
    </div>
  );
};

export default Admin;
