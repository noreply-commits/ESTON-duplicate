import React from 'react';
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
      <ul className="flex space-x-6">
        {adminLinks.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`text-white px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white ${location.pathname === link.path ? 'bg-blue-600' : ''}`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="ml-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
