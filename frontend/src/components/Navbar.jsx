import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const roleColors = {
    admin: '#e74c3c',
    waiter: '#2ecc71',
    cashier: '#f39c12',
  };

  const roleColor = user ? roleColors[user.role] || '#95a5a6' : '#95a5a6';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🍷</span>
        <span className="brand-text">BarPOS</span>
      </div>

      <div className="navbar-links">
        {/* Waiter & Admin: Tables */}
        {(user?.role === 'admin' || user?.role === 'waiter') && (
          <Link
            to="/tables"
            className={`nav-link ${isActive('/tables') ? 'active' : ''}`}
          >
            <span className="nav-icon">🪑</span> Tavolinat
          </Link>
        )}

        {/* Waiter & Admin: Kitchen */}
        {(user?.role === 'admin' || user?.role === 'waiter') && (
          <Link
            to="/kitchen"
            className={`nav-link ${isActive('/kitchen') ? 'active' : ''}`}
          >
            <span className="nav-icon">👨‍🍳</span> Kuzhina
          </Link>
        )}

        {/* Admin: Menu */}
        {user?.role === 'admin' && (
          <Link
            to="/menu"
            className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span> Menuja
          </Link>
        )}

        {/* Cashier & Admin: Payments */}
        {(user?.role === 'admin' || user?.role === 'cashier') && (
          <Link
            to="/payments"
            className={`nav-link ${isActive('/payments') ? 'active' : ''}`}
          >
            <span className="nav-icon">💳</span> Pagesat
          </Link>
        )}

        {/* Admin: Register */}
        {user?.role === 'admin' && (
          <Link
            to="/register"
            className={`nav-link ${isActive('/register') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span> Regjistro
          </Link>
        )}
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role" style={{ backgroundColor: roleColor }}>
            {user?.role}
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Dilni
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
