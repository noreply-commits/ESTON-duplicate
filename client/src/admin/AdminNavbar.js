import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const adminLinks = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Applications', path: '/admin/applications' },
  { name: 'Courses', path: '/admin/courses' },
  { name: 'Users', path: '/admin/users' },
];

const AdminNavbar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 pt-0 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo or Brand - optional */}
        <div className="text-white font-bold text-xl">Admin Panel</div>

        {/* Hamburger button (mobile only) */}
        <button
          onClick={toggleMenu}
          className="text-white md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            // Close icon (X)
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {adminLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-white px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white ${
                  location.pathname === link.path ? 'bg-blue-600' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-2">
          {adminLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)} // close menu on click
                className={`block text-white px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white ${
                  location.pathname === link.path ? 'bg-blue-600' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default AdminNavbar;
