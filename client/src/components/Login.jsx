import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import logo from './dealsdray_logo.jpeg'; // Replace with your logo path
import leftImage from './work.webp'; // Replace with your left side image path

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    let valid = true;
  
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Email is not valid.');
      valid = false;
    }
  
    // Validate password length
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      valid = false;
    }
  
    if (!valid) {
      return;
    }
  
    try {
      const result = await axios.post('http://localhost:3005/api/login', { username, email, password });
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user.serialNumber));
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err); // Log the error for debugging
      if (err.response && err.response.status === 401) {
        setLoginError('Invalid username or password.');
        alert('Invalid username or password.'); // Show alert for invalid credentials
      } else {
        alert('Invalid username or password'); // Show generic error alert
      }
    }
  };
  

  return (
    <div className="login-container">
      <header className="dashboard-header">
        <img src={logo} alt="Company Logo" className="logo" />
        <h1 style={{ textAlign: 'center' }}>DealsDray</h1>
      </header>
      <div className="content">
        <div className="image-container">
          <img src={leftImage} alt="Decorative" className="left-image" />
        </div>
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Login</h2>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username:</label>
              <input type="text" id="username" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
            {loginError && <p className="error-message">{loginError}</p>} {/* Display login error message */}
            <button type="submit" className="submit-button">Login</button>
            <a href="/signup" className="signup-link">
              <h3>Don't have an account? Sign up here</h3>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
