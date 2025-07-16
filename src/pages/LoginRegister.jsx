import React, { useState } from 'react'
import Button from '../components/Button/Button'
import LoginForm from '../components/LoginForm/LoginForm'
import RegisterForm from '../components/RegisterForm/RegisterForm'

const LoginRegister = () => {

   const [ isLogin, setIsLogin ] = useState(true); // Estado para controlar la vista (Login/Register)
   
   const toggleForm = () => {
      setIsLogin(!isLogin); // Cambia entre Login y Register
    };

    return (
      <div className="login-register-page">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <Button text={isLogin ? 'Go to Register' : 'Go to Login'} onClick={toggleForm} />
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    );
}

export default LoginRegister;