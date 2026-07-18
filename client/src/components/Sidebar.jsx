import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine,
  RiGroupLine,
  RiUserAddLine,
  RiLogoutBoxLine,
  RiShieldLine,
  RiBuildingLine,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: <RiDashboardLine />, label: 'Dashboard' },
    { to: '/employees', icon: <RiGroupLine />, label: 'Employees' },
    ...(isAdmin ? [{ to: '/employees/new', icon: <RiUserAddLine />, label: 'Add Employee' }] : []),
    ...(isAdmin ? [{ to: '/register', icon: <RiShieldLine />, label: 'Add User' }] : []),
  ];

  const getInitials = (name) => name?.charAt(0).toUpperCase() || '?';
  const getRoleColor = (role) => role === 'Admin' ? 'var(--accent-purple)' : 'var(--accent-blue)';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <RiBuildingLine />
        </div>
        <div className="logo-text">
          <span className="logo-title">EMS</span>
          <span className="logo-subtitle">Employee Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.to === '/dashboard'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-indicator"></span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${getRoleColor(user?.role)}, var(--accent-cyan))` }}>
            {getInitials(user?.username)}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-role" style={{ color: getRoleColor(user?.role) }}>
              {user?.role}
            </span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <RiLogoutBoxLine />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
