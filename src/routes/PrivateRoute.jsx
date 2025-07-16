import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Comprobar si hay un token en el localStorage (o sessionStorage)
  const token = localStorage.getItem('token');

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si hay token, permite que se acceda al contenido de la ruta
  return <Outlet />;
};

export default PrivateRoute;