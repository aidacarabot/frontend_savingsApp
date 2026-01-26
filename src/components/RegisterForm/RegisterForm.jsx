import './RegisterForm.css';
import { useForm } from 'react-hook-form';
import { fetchData } from '../../utils/api/fetchData';
import { useState } from 'react';
import Logo from '../Logo/Logo';

const RegisterForm = ({ onToggleForm }) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Manejo de la validación de contraseñas
  const validatePasswordMatch = (value) => {
    if (value !== getValues('password')) {
      return "Passwords do not match";
    }
    return true;
  };

  const onSubmit = async (formData) => {
    try {
      const response = await fetchData(
        '/users/register',
        'POST',
        formData
      );
      console.log('Registration successful:', response);
      alert('Registration successful. Please log in.');
      onToggleForm();
    } catch (error) {
      const errorMsg = error?.response?.error || 'There was an error during registration. Please try again.';
      alert(errorMsg);
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form-header">
        <Logo />
      </div>

      <div className="register-form-content">
        <h1 className="register-title">Create your account.</h1>
        <p className="register-subtitle">Enter your information to get started.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10C11.6569 10 13 8.65685 13 7C13 5.34315 11.6569 4 10 4C8.34315 4 7 5.34315 7 7C7 8.65685 8.34315 10 10 10Z M10 10C7.23858 10 5 12.2386 5 15V16.5M10 10C12.7614 10 15 12.2386 15 15V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input 
                {...register("name", { required: "Name is required" })} 
                type="text"
                placeholder="Full Name"
                className={errors.name ? 'error' : ''}
              />
            </div>
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.83333 4.16667H14.1667C15.0871 4.16667 15.8333 4.91286 15.8333 5.83333V14.1667C15.8333 15.0871 15.0871 15.8333 14.1667 15.8333H5.83333C4.91286 15.8333 4.16667 15.0871 4.16667 14.1667V5.83333C4.16667 4.91286 4.91286 4.16667 5.83333 4.16667Z M13.3333 2.5V5.83333 M6.66667 2.5V5.83333 M4.16667 9.16667H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input 
                {...register("birthDate", { required: "Birth Date is required" })} 
                type="text"
                placeholder="Enter your birth date"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                className={errors.birthDate ? 'error' : ''}
              />
            </div>
            {errors.birthDate && <p className="error-message">{errors.birthDate.message}</p>}
          </div>

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

          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.83333 9.16669V6.66669C5.83333 4.36545 7.69881 2.50002 10 2.50002C12.3012 2.50002 14.1667 4.36545 14.1667 6.66669V9.16669M10 12.0834V13.75M6.5 17.5H13.5C14.4205 17.5 15.1667 16.7538 15.1667 15.8334V10.8334C15.1667 9.91288 14.4205 9.16669 13.5 9.16669H6.5C5.57953 9.16669 4.83333 9.91288 4.83333 10.8334V15.8334C4.83333 16.7538 5.57953 17.5 6.5 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {showRepeatPassword ? (
                    <path d="M2.5 10C2.5 10 5 4.16669 10 4.16669C15 4.16669 17.5 10 17.5 10C17.5 10 15 15.8334 10 15.8334C5 15.8334 2.5 10 2.5 10Z M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61931 11.3807 7.50002 10 7.50002C8.61929 7.50002 7.5 8.61931 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M3.53553 3.53555L16.4645 16.4645M8.17157 8.17159C7.42143 8.92173 7.42143 10.1373 8.17157 10.8874C8.92172 11.6376 10.1373 11.6376 10.8874 10.8874M8.17157 8.17159L10.8874 10.8874M8.17157 8.17159L6.46967 6.46968M10.8874 10.8874L12.7728 12.7728M6.46967 6.46968C7.71627 5.65704 9.19977 5.16669 10.8284 5.16669C15.5 5.16669 17.5 10 17.5 10C17.1478 10.7069 16.5993 11.5183 15.8891 12.2786M6.46967 6.46968L2.5 2.50002M12.7728 12.7728C11.7363 13.4821 10.4824 13.8334 9.17157 13.8334C4.5 13.8334 2.5 9.00002 2.5 9.00002C2.93508 8.13308 3.61824 7.19302 4.53553 6.34847L12.7728 12.7728Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
              </button>
            </div>
            {errors.repeatPassword && <p className="error-message">{errors.repeatPassword.message}</p>}
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <button onClick={onToggleForm} className="login-link">Log in</button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;