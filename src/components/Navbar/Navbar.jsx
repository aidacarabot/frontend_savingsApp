import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch';
import Loader from '../Loader/Loader';

const Navbar = () => {
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');

  // Usamos el hook para obtener los datos del usuario y actualizar localStorage automáticamente
  const { responseData, loading, error } = useApiFetch(
    '/users',
    'GET',
    null,
    null,
    'name',
    'user_name'
  );

  // Actualiza el estado local cuando cambia el nombre en localStorage
  useEffect(() => {
    if (responseData && responseData.name !== userName) {
      setUserName(responseData.name);
    }
  }, [responseData, userName]);

   if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>; //! Ver que hacer con esto

  return (
    <nav>
      <div className="navbar-user-info">
        <img src="/assets/default-profile.png" alt="User Picture" className="user-picture" />
        <p>{userName}</p>
        <ul>
          <li><Link to="/user"> Personal Information </Link></li>
        </ul>
      </div>
      <ul>
        <li><Link to="/overview"> Overview </Link></li>
        <li><Link to="/transactions"> Transactions </Link></li>
        <li><Link to="/goals"> Goals </Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;