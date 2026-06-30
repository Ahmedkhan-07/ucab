import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-dark text-light min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="container text-center py-5 rounded-4 shadow-lg" style={{
        maxWidth: '800px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 className="display-2 fw-bold text-primary mb-3">Welcome to Ucab</h1>
        <p className="lead text-secondary fs-4 mb-5">
          Seamless, reliable, and premium cab booking service at your fingertips.
          Book your ride today and experience comfort like never before.
        </p>
        
        <div className="row g-3 justify-content-center my-4">
          <div className="col-12 col-sm-auto">
            <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 shadow-lg fw-bold w-100">
              Sign In
            </Link>
          </div>
          <div className="col-12 col-sm-auto">
            <Link to="/register" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold w-100">
              Register
            </Link>
          </div>
        </div>

        <hr className="my-5 border-secondary" style={{ opacity: 0.2 }} />

        <div className="d-flex justify-content-center align-items-center flex-column">
          <p className="text-secondary mb-2 small">Are you an administrator?</p>
          <Link to="/alogin" className="btn btn-sm btn-outline-secondary px-3 py-2 fw-semibold">
            Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
