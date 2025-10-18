import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, setAuthModalOpen } = useAuth();

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              SmartLearn
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <NavLink
                  to="/my-courses"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  My Courses
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  Profile
                </NavLink>
                <span className="text-gray-300 text-sm hidden sm:block truncate" title={user.email ?? ''}>
                  {user.user_metadata.displayName || user.email}
                </span>
                <button 
                  onClick={logout}
                  className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;