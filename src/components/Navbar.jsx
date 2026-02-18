// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.messages);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
            Roommate Finder
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/create-listing" className="navbar-link">
                Post Listing
              </Link>
              <Link to="/my-listings" className="navbar-link">
                My Listings
              </Link>
              <Link to="/messages" className="navbar-link">
                Messages {unreadCount > 0 && (
                  <span className="badge">{unreadCount}</span>
                )}
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="navbar-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn">
                Login
              </Link>
              <Link to="/register" className="navbar-btn primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;