import { Link } from 'react-router-dom';

const Uhome = () => {
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <div className="py-4 text-light">
      <div className="card text-bg-primary border-0 rounded-4 shadow mb-5">
        <div className="card-body p-5">
          <h1 className="fw-bold display-4 mb-2">Welcome Back, {userName}!</h1>
          <p className="lead mb-0">Where would you like to travel today? Select one of the options below to get started.</p>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 rounded-4 shadow h-100 bg-dark text-light" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-inline-flex p-3 rounded-3 bg-primary text-white mb-3">
                  {/* Fallback to simple icon text if bootstrap-icons hasn't loaded */}
                  <span className="fs-3">🚗</span>
                </div>
                <h3 className="card-title fw-bold">Book a Cab</h3>
                <p className="card-text text-secondary mt-2">
                  Browse our range of available cabs, check driver details, pricing per kilometer, and book your ride instantly.
                </p>
              </div>
              <Link to="/cabs" className="btn btn-primary btn-lg mt-4 fw-semibold w-100 shadow">
                Explore Cabs
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 rounded-4 shadow h-100 bg-dark text-light" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-inline-flex p-3 rounded-3 bg-success text-white mb-3">
                  <span className="fs-3">📋</span>
                </div>
                <h3 className="card-title fw-bold">My Bookings</h3>
                <p className="card-text text-secondary mt-2">
                  View your complete booking history, check your ride details, or cancel your active requests.
                </p>
              </div>
              <Link to="/mybookings" className="btn btn-success btn-lg mt-4 fw-semibold w-100 shadow">
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uhome;
