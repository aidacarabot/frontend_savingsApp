import { useState, useEffect } from 'react';
import './Navbar.css';
import { LayoutDashboard, ChessQueen, CircleUserRound, LogOut, ArrowLeftRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import Logo from '../Logo/Logo';
import AreYouSure from '../AreYouSure/AreYouSure';
import Button from '../Button/Button';

const Navbar = () => {
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  const { responseData, loading, error } = useApiFetch(
    '/users',
    'GET',
    null,
    null,
    'name',
    'user_name'
  );

  
  useEffect(() => {
    if (responseData && responseData.name !== userName) {
      setUserName(responseData.name);
    }
  }, [responseData, userName]);

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
      <Button className='logout-button' onClick={handleLogoutClick} text={<><LogOut size={18} />Logout</>} />
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