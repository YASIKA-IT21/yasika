import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import leftImage from './work.webp';
import logo from './dealsdray_logo.jpeg'; 

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
   
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Email is not valid.');
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      await axios.post('http://localhost:3005/api/create', { username, email, password });
      alert('Signup successful!');
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
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
          <h2 className="form-title">Signup</h2>
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username:</label>
            <input type="text" id="username" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} />
            {usernameError && <p className="error-message">{usernameError}</p>}
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
            <input type="password" id="confirmPassword" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
          </div>
          
          <button type="submit" className="submit-button">Signup</button>
          <a href="/" style={{ textAlign: 'center', display: 'block' }}>
            <h3>Already have an account? Click here</h3>
          </a>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Signup;
