import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, Shield, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ChatbotWidget from '../components/layout/ChatbotWidget';

const DashboardLayout = () => {
  const { user, isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-sage-600 text-white'
        : 'text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800'
    }`;

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-sage-900 flex">
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-sage-800 border-r border-sage-100 dark:border-sage-700 p-6">
        <Link to="/" className="font-display text-xl font-semibold text-sage-800 dark:text-sage-100 mb-8">
          Harmony
        </Link>
        <p className="text-xs text-sage-500 mb-6">Welcome, {user?.name}</p>
        <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/my-sessions" className={linkClass}>
            <Calendar size={18} /> My Sessions
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            <User size={18} /> Profile
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              <Shield size={18} /> Admin
            </NavLink>
          )}
        </nav>
        <NavLink to="/" className="flex items-center gap-2 text-sm text-sage-500 hover:text-sage-700 mt-4">
          <Home size={16} /> Back to site
        </NavLink>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <Outlet />
      </main>
      <ChatbotWidget />
    </div>
  );
};

export default DashboardLayout;
