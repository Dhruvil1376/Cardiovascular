import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Activity, LayoutDashboard, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-icon">
            <Heart size={28} fill="#e11d48" color="#e11d48" />
          </span>
          <span>CardioPredict</span>
        </NavLink>

        <button 
          className="mobile-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
              end
            >
              <Heart size={18} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/prediction" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <Activity size={18} />
              <span>Prediction</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
