import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as necessary
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import './login.css'; // Ensure the path matches your CSS file for the Login component
import logo from '../core/img/Vulgo.svg'; // Adjust the path as necessary for your logo

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth(); // Destructure the login and resetPassword methods from useAuth

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any existing errors

    try {
      await login(email, password); // Attempt to log the user in
      navigate('/'); // Navigate to the home page upon successful login
    } catch (error) {
      setError("Failed to log in"); // Set an error message for login failure
      console.error(error);
    }
  };

  const handleForgotPassword = async () => {
    const emailToReset = prompt("Please enter your email address:");
    if (emailToReset) {
      try {
        await resetPassword(emailToReset);
        alert('Password reset email sent'); // Notify the user
      } catch (error) {
        setError("Failed to send reset email"); // Set an error message for reset failure
        console.error(error);
      }
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the sign-up page
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Login</h1>
        <p>Please sign in to continue.</p>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          {error && <div className="error-message">{error}</div>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <button onClick={handleForgotPassword} className="forgot-password">
          Forgot Password?
        </button>
        <div className="signup-option">
          Don't have an account? <span onClick={handleSignUpClick} style={{ cursor: 'pointer', color: 'blue' }}>Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
