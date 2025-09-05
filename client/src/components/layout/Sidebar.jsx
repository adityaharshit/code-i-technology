import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  BookCopy, 
  CreditCard, 
  User, 
  Users, 
  Book, 
  BarChart2,
  LogOut,
  ChevronDown
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/my-courses', icon: <BookCopy size={20} />, text: 'My Courses' },
    { to: '/transactions', icon: <CreditCard size={20} />, text: 'Transactions' },
    { to: '/profile', icon: <User size={20} />, text: 'Profile' },
  ];
  
  const adminLinks = [
    { to: '/admin-dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/admin/users', icon: <Users size={20} />, text: 'User Management' },
    { to: '/admin/courses', icon: <Book size={20} />, text: 'Course Management' },
    { to: '/admin/transactions', icon: <BarChart2 size={20} />, text: 'Transactions' },
  ];

  const links = user?.type === 'admin' ? adminLinks : studentLinks;
  
  const navLinkClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-lg'
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-800 bg-opacity-90 backdrop-blur-md border-r border-gray-700 flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-gray-700">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">CIT</span>
        </div>
        <span className="text-white font-bold text-xl">Code i Technology</span>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={navLinkClasses}
            end
          >
            {link.icon}
            <span className="font-medium">{link.text}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto">
        <div className="p-3 bg-gray-700 rounded-lg mb-2">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-white">
                    {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
            </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-ternary2"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

