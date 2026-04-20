import { useState, useEffect } from 'react';
import './Navbar.css';
import { LayoutDashboard, ChessQueen, CircleUserRound, LogOut, ArrowLeftRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch';
import Loader from '../Loader/Loader';
import { ErrorMessage } from '../Messages/Messages';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import Logo from '../Logo/Logo';
import AreYouSure from '../AreYouSure/AreYouSure';

const Navbar = () => {
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
  if (error) return <ErrorMessage text={`Error: ${error.message}`} duration={null} />;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  return (
    <nav>
      <Logo />
      <div className='navbar-user-info'>
        <ProfilePicture />
        <p className='username'>{userName}</p>
        <ul>
          <li>
            <Link to='/user' className={location.pathname === '/user' ? 'active' : ''}>
              <CircleUserRound className='nav-icon' size={16} /> User Details
            </Link>
          </li>
        </ul>
      </div>
      <span className='nav-section-label'>Navigation</span>
      <ul>
        <li>
          <Link to='/overview' className={location.pathname === '/overview' ? 'active' : ''}>
            <LayoutDashboard className='nav-icon' size={18} /> Overview
          </Link>
        </li>
        <li>
          <Link to='/transactions' className={location.pathname === '/transactions' ? 'active' : ''}>
            <ArrowLeftRight className='nav-icon' size={18} /> Transactions
          </Link>
        </li>
        <li>
          <Link to='/goals' className={location.pathname === '/goals' ? 'active' : ''}>
            <ChessQueen className='nav-icon' size={18} /> Goals
          </Link>
        </li>
        <li className='mobile-only'>
          <Link to='/user' className={location.pathname === '/user' ? 'active' : ''}>
            <CircleUserRound className='nav-icon' size={18} /> User
          </Link>
        </li>
      </ul>
      <button className='logout-button' onClick={handleLogoutClick}>
        <LogOut size={18} />
        Logout
      </button>
      {showLogoutConfirm && (
        <AreYouSure
          message='Are you sure you want to logout?'
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </nav>
  )
};

export default Navbar;