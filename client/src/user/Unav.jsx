import { Link, useNavigate } from 'react-router-dom';

const Unav = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-3" to="/uhome">
          Ucab
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#userNavbar"
          aria-controls="userNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="userNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/uhome">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cabs">Cabs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mybookings">My Bookings</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {userName && <span className="text-light me-3">Hello, <strong className="text-primary">{userName}</strong>!</span>}
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Unav;
