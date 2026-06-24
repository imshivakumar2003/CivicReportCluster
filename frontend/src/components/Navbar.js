import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, PlusCircle, LayoutDashboard, User } from 'lucide-react'; // Using Lucide for cleaner icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl
    ${isActive(path)
      ? 'text-blue-600 bg-blue-50/80 shadow-sm'
      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}
  `;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Brand Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative overflow-hidden w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">
              Civic<span className="text-blue-600">Pulse</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-1 mr-4 border-r border-gray-100 pr-4">
                {user.role === 'user' ? (
                  <>
                    <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/new-complaint" className={navLinkClass('/new-complaint')}>
                      <span className="flex items-center gap-1.5">
                        <PlusCircle size={16} /> New Report
                      </span>
                    </Link>
                  </>
                ) : (
                  <Link to="/admin" className={navLinkClass('/admin')}>
                    Admin Panel
                  </Link>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 pl-3 pr-1 py-1 rounded-full border border-gray-100">
                  <div className="hidden lg:block text-right">
                    <p className="text-xs font-bold text-gray-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">Dashboard</Link>
                <Link to="/new-complaint" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">New Report</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid gap-2 pt-2">
                <Link to="/login" className="w-full text-center py-3 text-gray-600 font-medium">Login</Link>
                <Link to="/register" className="w-full text-center py-3 bg-blue-600 text-white rounded-xl font-bold">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;