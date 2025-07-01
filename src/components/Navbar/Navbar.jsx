import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav>
      <img src="/userpicture.png" alt="User Picture" className="user-picture" />
      <ul>
        <li><Link to="/user"> Personal Information </Link></li>
        <li><Link to="/overview"> Overview </Link></li>
        <li><Link to="/transactions"> Transactions </Link></li>
        <li><Link to="/goals"> Goals </Link></li>
      </ul>
    </nav>
  )
}

export default Navbar