import { useState, useEffect } from 'react';
import './Navbar.css';
import { LayoutDashboard, ChartPie, ChessQueen, CircleUserRound, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch';
import Loader from '../Loader/Loader';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import Logo from '../Logo/Logo';

const Navbar = () => {
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav>
      <Logo />
      <div className='navbar-user-info'>
        <ProfilePicture />
        <p className='username'>{userName}</p>
        <ul>
          <li>
            <Link to='/user' className={location.pathname === '/user' ? 'active' : ''}>
              <CircleUserRound className='nav-icon' size={20} /> User Details
            </Link>
          </li>
        </ul>
      </div>
      <ul>
        <li>
          <Link to='/overview' className={location.pathname === '/overview' ? 'active' : ''}>
            <LayoutDashboard className='nav-icon' size={20} /> Overview
          </Link>
        </li>
        <li>
          <Link to='/transactions' className={location.pathname === '/transactions' ? 'active' : ''}>
            <ChartPie className='nav-icon' size={20} /> Transactions
          </Link>
        </li>
        <li>
          <Link to='/goals' className={location.pathname === '/goals' ? 'active' : ''}>
            <ChessQueen className='nav-icon' size={20} /> Goals
          </Link>
        </li>
      </ul>
      <button className='logout-button' onClick={handleLogout}>
        <LogOut className='nav-icon' size={20} />
        Logout
      </button>
    </nav>
  )
};

export default Navbar;