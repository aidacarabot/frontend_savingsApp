import { useForm } from 'react-hook-form';
import { fetchData } from '../../utils/api/fetchData';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './LoginForm.css';
import Logo from '../Logo/Logo';

const LoginForm = ({ onToggleForm }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (formData) => {
    try {
     const response = await fetchData(
        '/users/login',
        'POST',
        formData
      );

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user._id); 
        alert('Login successful');
        navigate('/overview');
      } else {
        alert('Login failed. Invalid credentials.');
      }
    } catch (error) {
      if(error) {
        alert('Email or password is incorrect. Please try again.');
      }
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <Logo />
      </div>

      <div className="login-form-content">
        <h1 className="login-title">Log in to your account.</h1>
        <p className="login-subtitle">Enter your email address and password to log in.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6.66669L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66669M4.16667 15H15.8333C16.7538 15 17.5 14.2538 17.5 13.3334V6.66669C17.5 5.74621 16.7538 5.00002 15.8333 5.00002H4.16667C3.24619 5.00002 2.5 5.74621 2.5 6.66669V13.3334C2.5 14.2538 3.24619 15 4.16667 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input 
                {...register("email", { required: "Email is required" })} 
                type="email" 
                placeholder="Email Address"
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.83333 9.16669V6.66669C5.83333 4.36545 7.69881 2.50002 10 2.50002C12.3012 2.50002 14.1667 4.36545 14.1667 6.66669V9.16669M10 12.0834V13.75M6.5 17.5H13.5C14.4205 17.5 15.1667 16.7538 15.1667 15.8334V10.8334C15.1667 9.91288 14.4205 9.16669 13.5 9.16669H6.5C5.57953 9.16669 4.83333 9.91288 4.83333 10.8334V15.8334C4.83333 16.7538 5.57953 17.5 6.5 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input 
                {...register("password", { required: "Password is required" })} 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                className={errors.password ? 'error' : ''}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {showPassword ? (
                    <path d="M2.5 10C2.5 10 5 4.16669 10 4.16669C15 4.16669 17.5 10 17.5 10C17.5 10 15 15.8334 10 15.8334C5 15.8334 2.5 10 2.5 10Z M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61931 11.3807 7.50002 10 7.50002C8.61929 7.50002 7.5 8.61931 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M3.53553 3.53555L16.4645 16.4645M8.17157 8.17159C7.42143 8.92173 7.42143 10.1373 8.17157 10.8874C8.92172 11.6376 10.1373 11.6376 10.8874 10.8874M8.17157 8.17159L10.8874 10.8874M8.17157 8.17159L6.46967 6.46968M10.8874 10.8874L12.7728 12.7728M6.46967 6.46968C7.71627 5.65704 9.19977 5.16669 10.8284 5.16669C15.5 5.16669 17.5 10 17.5 10C17.1478 10.7069 16.5993 11.5183 15.8891 12.2786M6.46967 6.46968L2.5 2.50002M12.7728 12.7728C11.7363 13.4821 10.4824 13.8334 9.17157 13.8334C4.5 13.8334 2.5 9.00002 2.5 9.00002C2.93508 8.13308 3.61824 7.19302 4.53553 6.34847L12.7728 12.7728Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <p className="signup-text">
          Don't you have an account? <button onClick={onToggleForm} className="signup-link">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;