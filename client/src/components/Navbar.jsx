import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaBell, FaBars, FaTimes, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Buy', path: '/buy' },
    { name: 'Rent', path: '/rent' },
    { name: 'Sell', path: '/sell' },
    { name: 'Find an Agent', path: '/agent' },
    { name: 'New Projects', path: '/developer-properties' },
  ];

  const authLinks = isAuthenticated
    ? [
        { name: 'Become an Agent', path: '/become-agent' },
        { name: 'Notifications', path: '/notifications', icon: <FaBell className="text-xl" /> },
        { name: user?.firstName || 'Profile', path: '/profile', icon: <FaUser className="text-xl" /> },
        { name: 'Logout', action: handleLogout, icon: <FaSignOutAlt className="text-xl" /> },
      ]
    : [
        { name: 'Notifications', path: '/notifications', icon: <FaBell className="text-xl" /> },
        { name: 'Login', path: '/login' },
        { name: 'Sign Up', path: '/register', isButton: true },
      ];

  return (
    <>
      {/* WordPress-Style Admin Strip (Visible only for admin users and not in admin dashboard) */}
      {isAuthenticated && user?.role === 'admin' && !location.pathname.startsWith('/admin') && (
        <div className="fixed top-0 left-0 w-full h-8 bg-[#23282d] text-white text-[13px] font-sans flex items-center px-4 z-[1000]">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-2.5 py-1 hover:bg-[#32373c] transition-colors duration-200"
          >
            <FaTachometerAlt className="text-base" />
            <span>Admin Dashboard</span>
          </button>
        </div>
      )}

      <nav className={`bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#141414] text-white py-4 px-4 sm:px-6 shadow-[0_4px_12px_rgba(112,59,247,0.2)] font-urbanist sticky z-[100] ${location.pathname.startsWith('/admin') ? 'top-0' : 'top-8'}`}>
        <div className="w-full mx-auto flex items-center justify-between relative">
          {/* Hamburger Menu Button (Visible on Mobile) */}
          <button
            className="lg:hidden text-3xl p-3 bg-gray-800 rounded-md hover:bg-[#703BF7] hover:text-white focus:ring-2 focus:ring-[#703BF7] transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Left Nav Links (Desktop) */}
          <ul className="hidden lg:flex gap-3 items-center text-base font-semibold">
            {navLinks.map((link) => (
              <li
                key={link.name}
                onClick={() => navigate(link.path)}
                className="relative px-3.5 py-2.5 transition-all duration-300 hover:text-[#703BF7] cursor-pointer group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#703BF7] transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* Centered Logo */}
          <div
            onClick={() => navigate('/')}
            className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff] transform hover:scale-105 transition-transform duration-300 cursor-pointer absolute left-1/2 -translate-x-1/2 z-20"
          >
            Tamalak
          </div>

          {/* Right Nav Links (Desktop) */}
          <ul className="hidden lg:flex gap-3 items-center text-base font-semibold">
            {authLinks.map((link) => (
              <li
                key={link.name}
                onClick={link.action || (() => navigate(link.path))}
                className={`relative px-3.5 py-2.5 transition-all duration-300 cursor-pointer group ${
                  link.isButton
                    ? 'bg-[#703BF7] text-white rounded-full px-4.5 hover:bg-[#5f2cc6]'
                    : 'hover:text-[#703BF7] flex items-center gap-2'
                }`}
              >
                {link.icon}
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    link.isButton ? 'bg-white' : 'bg-[#703BF7]'
                  }`}
                ></span>
              </li>
            ))}
          </ul>

          {/* Mobile Menu (Visible when hamburger is clicked) */}
          <div
            className={`lg:hidden fixed top-8 left-0 w-full h-screen bg-[#141414] bg-opacity-95 transform ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out z-40`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-xl font-semibold">
              {[...navLinks, ...authLinks].map((link) => (
                <div
                  key={link.name}
                  onClick={() => {
                    link.action ? link.action() : navigate(link.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                    link.isButton
                      ? 'bg-[#703BF7] text-white rounded-full px-6'
                      : 'hover:text-[#703BF7]'
                  } cursor-pointer`}
                >
                  {link.icon}
                  {link.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;