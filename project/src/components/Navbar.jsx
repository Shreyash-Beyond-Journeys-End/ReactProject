import { Link, useLocation } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { FaSun, FaMoon, FaGamepad, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { state, dispatch } = useGameContext();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative px-4 py-2 rounded-lg transition-all duration-300 group
          ${isActive
            ? 'text-blue-500 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400'
          }`}
      >
        <span className="relative z-10">{children}</span>
      
        <span className={`absolute inset-0 rounded-lg transition-all duration-300 
          ${isActive
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : 'bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50'
          }`}
        />
       
        <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 
          bg-gradient-to-r from-blue-500 to-purple-500
          ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
        />
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled
        ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg'
        : 'bg-white dark:bg-gray-800'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <FaGamepad className="text-2xl text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text transform transition-transform duration-300 group-hover:scale-110" />
              <div className="flex items-center gap-2">
                <FaGamepad className="text-2xl text-blue-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Game Library
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/library">Library</NavLink>
            <NavLink to="/add-game">Add Game</NavLink>
            <NavLink to="/profile">Profile</NavLink>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-colors duration-300 group"
              aria-label="Toggle theme"
            >
              {state.darkMode ? (
                <FaSun className="w-5 h-5 text-yellow-400 transform transition-transform 
                  duration-300 group-hover:rotate-180" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-600 transform transition-transform 
                  duration-300 group-hover:-rotate-90" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-200 
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

 
      <div className={`md:hidden transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700">
          <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/library" onClick={() => setIsMobileMenuOpen(false)}>
            Library
          </MobileNavLink>
          <MobileNavLink to="/add-game" onClick={() => setIsMobileMenuOpen(false)}>
            Add Game
          </MobileNavLink>
          <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
            Profile
          </MobileNavLink>

          <div className="pt-2 border-t dark:border-gray-700">
            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 rounded-lg text-lefttext-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700transition-colors duration-300"
            >
              {state.darkMode ? (
                <>
                  <FaSun className="w-5 h-5 text-yellow-400 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <FaMoon className="w-5 h-5 mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


const MobileNavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-2 rounded-lg transition-colors duration-300
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;