import { Eye, EyeClosed, Mail, LockKeyhole } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { fetchData } from '../../utils/api/fetchData';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './LoginForm.css';
import Logo from '../Logo/Logo';
import Loader from '../Loader/Loader';
import { SuccessMessage, ErrorMessage } from '../Messages/Messages';

const LoginForm = ({ onToggleForm = null }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
     const response = await fetchData(
        '/users/login',
        'POST',
        formData
      );

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user._id); 
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          navigate('/overview');
        }, 1500);
      } else {
        setErrorMessage('Login failed. Invalid credentials.');
      }
    } catch (error) {
      const errorMsg = error?.response?.error || error?.message || 'Email or password is incorrect. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="login-form-container">
      {successMessage && <SuccessMessage text={successMessage} />}
      {errorMessage && <ErrorMessage text={errorMessage} />}
      <div className="login-form-header">
        <Logo />
      </div>

      <div className="login-form-content">
        <h1 className="login-title">Log in to your account.</h1>
        <p className="login-subtitle">Enter your email address and password to log in.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="auth-form-group">
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <Mail size={20} />
              </span>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email Address"
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <p className="auth-error-message">{errors.email.message}</p>}
          </div>

          <div className="auth-form-group">
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <LockKeyhole size={20} />
              </span>
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>
            {errors.password && <p className="auth-error-message">{errors.password.message}</p>}
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <p className="signup-text">
          Don't you have an account? <button type="button" onClick={() => onToggleForm ? onToggleForm() : navigate('/register')} className="signup-link">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;