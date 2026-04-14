import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
         
          <h1>Smart RFID Motorcycle Gate Access and Monitoring System</h1>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Gate Entry</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/vehicles" className="nav-link">Vehicles</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
