import './RegisterForm.css';
import { LockKeyhole, UserRound, Calendar, Eye, EyeClosed, Mail, CircleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { fetchData } from '../../utils/api/fetchData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import Loader from '../Loader/Loader';
import Button from '../Button/Button';
import { SuccessMessage } from '../Messages/Messages';

const RegisterForm = ({ onToggleForm = null }) => {
  const { register, handleSubmit, formState: { errors }, getValues, setError } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  
  const validatePasswordMatch = (value) => {
    if (value !== getValues('password')) {
      return "Passwords do not match";
    }
    return true;
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await fetchData(
        '/users/register',
        'POST',
        formData
      );
      setSuccessMessage('Registration successful. Please log in.');
      setTimeout(() => {
        onToggleForm ? onToggleForm() : navigate('/login');
      }, 2000);
    } catch (error) {
      const rawMsg = error?.error || error?.message || error?.response?.error || '';
      const isDuplicateEmail = /email|already|duplicate|exists|registered/i.test(rawMsg);

      if (isDuplicateEmail) {
        setError('email', {
          type: 'manual',
          message: 'This email is already registered. Try logging in instead.',
        });
      } else {
        setErrorMessage(rawMsg || 'There was an error during registration. Please try again.');
      }
      console.error('Error during registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="register-form-container">
      {successMessage && <SuccessMessage text={successMessage} />}
      <div className="register-form-header">
        <Logo />
      </div>

      <div className="register-form-content">
        <h1 className="register-title">Create your account.</h1>
        <p className="register-subtitle">Enter your information to get started.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          {errorMessage && (
            <div className="auth-form-error">
              <CircleAlert size={18} />
              <span>{errorMessage}</span>
            </div>
          )}
          <div className="auth-form-group">
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <UserRound size={20} />
              </span>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Full Name"
                className={errors.name ? 'error' : ''}
              />
            </div>
            {errors.name && <p className="auth-error-message">{errors.name.message}</p>}
          </div>

          <div className="auth-form-group">
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <Calendar size={20} />
              </span>
              <input
                {...register("birthDate", { required: "Birth Date is required" })}
                type="text"
                placeholder="Enter your birth date (YYYY-MM-DD)"
                className={errors.birthDate ? 'error' : ''}
              />
            </div>
            {errors.birthDate && <p className="auth-error-message">{errors.birthDate.message}</p>}
          </div>

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
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
              />
              <Button
                className="auth-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                text={showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              />
            </div>
            {errors.password && <p className="auth-error-message">{errors.password.message}</p>}
          </div>

          <div className="auth-form-group">
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <LockKeyhole size={20} />
              </span>
              <input
                {...register("repeatPassword", {
                  required: "Repeat Password is required",
                  validate: validatePasswordMatch
                })}
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat Password"
                className={errors.repeatPassword ? 'error' : ''}
              />
              <Button
                className="auth-toggle-password"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                text={showRepeatPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              />
            </div>
            {errors.repeatPassword && <p className="auth-error-message">{errors.repeatPassword.message}</p>}
          </div>

          <Button type="submit" className="register-button" text="Register" />
        </form>

        <p className="login-text">
          Already have an account? <Button onClick={() => onToggleForm ? onToggleForm() : navigate('/login')} className="login-link" text="Log in" />
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;