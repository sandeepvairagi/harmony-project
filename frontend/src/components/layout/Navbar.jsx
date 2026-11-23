import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { closeMobileMenu, toggleMobileMenu } from '../../redux/slices/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? 'text-sage-700 dark:text-sage-200' : 'text-sage-500 hover:text-sage-700 dark:hover:text-sage-200'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-sage-900/80 backdrop-blur-lg border-b border-sage-100 dark:border-sage-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white font-display font-bold text-sm">
              H
            </span>
            <span className="font-display text-xl font-semibold text-sage-800 dark:text-sage-100">
              Harmony
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/instructors" className={navClass}>Explore</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
                <NavLink to="/my-sessions" className={navClass}>My Sessions</NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={navClass}>Admin</NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>Login</NavLink>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-sage-600 text-white text-sm font-medium rounded-full hover:bg-sage-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-sage-100 dark:hover:bg-sage-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {isAuthenticated && (
              <button onClick={logout} className="p-2 text-sage-500 hover:text-sage-700 transition">
                <LogOut size={18} />
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-sage-100 dark:border-sage-800 flex flex-col gap-3">
            <NavLink to="/instructors" className={navClass} onClick={() => dispatch(closeMobileMenu())}>Explore</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navClass} onClick={() => dispatch(closeMobileMenu())}>Dashboard</NavLink>
                <NavLink to="/my-sessions" className={navClass} onClick={() => dispatch(closeMobileMenu())}>My Sessions</NavLink>
                <button onClick={logout} className="text-left text-sage-500">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass} onClick={() => dispatch(closeMobileMenu())}>Login</NavLink>
                <NavLink to="/signup" className={navClass} onClick={() => dispatch(closeMobileMenu())}>Sign Up</NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
