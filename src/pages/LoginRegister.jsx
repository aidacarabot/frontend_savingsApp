import React, { useState } from 'react'
import LoginForm from '../components/LoginForm/LoginForm'
import RegisterForm from '../components/RegisterForm/RegisterForm'

const LoginRegister = () => {

   const [ isLogin, setIsLogin ] = useState(true); // Estado para controlar la vista (Login/Register)
   
   const toggleForm = () => {
      setIsLogin(!isLogin); // Cambia entre Login y Register
    };

    return (
      <div className="login-register-page">
        {isLogin ? <LoginForm onToggleForm={toggleForm} /> : <RegisterForm onToggleForm={toggleForm} />}
      </div>
    );
}

export default LoginRegister;