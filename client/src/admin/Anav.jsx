import { Link, useNavigate } from 'react-router-dom';

const Anav = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger bg-opacity-75 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white fs-3" to="/ahome">
          Ucab Admin
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/ahome">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/users">Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/bookings">Bookings</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/acabs">Cabs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/addcar">Add Cab</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Hello, <strong className="text-warning">{adminName}</strong>!</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Anav;
