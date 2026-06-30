import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Ahome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/bookings/stats');
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch admin stats. Make sure your server is running and database is connected.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-danger">Loading dashboard stats...</p>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Control Center</h2>
        <span className="badge bg-danger p-2">System Administrator Mode</span>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card bg-dark text-light border-danger h-100 shadow-sm" style={{ borderLeftWidth: '5px', borderStyle: 'solid' }}>
            <div className="card-body p-4 text-center">
              <span className="fs-1 mb-2 d-block">👥</span>
              <h5 className="card-title text-secondary small uppercase fw-bold">Total Users</h5>
              <p className="card-text fs-2 fw-bold text-white mb-0">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-light border-primary h-100 shadow-sm" style={{ borderLeftWidth: '5px', borderStyle: 'solid' }}>
            <div className="card-body p-4 text-center">
              <span className="fs-1 mb-2 d-block">🚕</span>
              <h5 className="card-title text-secondary small uppercase fw-bold">Total Cabs</h5>
              <p className="card-text fs-2 fw-bold text-white mb-0">{stats?.totalCars || 0}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-light border-success h-100 shadow-sm" style={{ borderLeftWidth: '5px', borderStyle: 'solid' }}>
            <div className="card-body p-4 text-center">
              <span className="fs-1 mb-2 d-block">📅</span>
              <h5 className="card-title text-secondary small uppercase fw-bold">Total Bookings</h5>
              <p className="card-text fs-2 fw-bold text-white mb-0">{stats?.totalBookings || 0}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-light border-warning h-100 shadow-sm" style={{ borderLeftWidth: '5px', borderStyle: 'solid' }}>
            <div className="card-body p-4 text-center">
              <span className="fs-1 mb-2 d-block">💰</span>
              <h5 className="card-title text-secondary small uppercase fw-bold">Total Revenue</h5>
              <p className="card-text fs-2 fw-bold text-white mb-0">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3 text-secondary">Quick Administration Actions</h4>
      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <Link to="/users" className="btn btn-dark border-secondary p-4 w-100 text-start rounded-3 h-100 shadow-sm text-decoration-none">
            <span className="fs-2 mb-2 d-block">👥</span>
            <h5 className="fw-bold text-white mb-1">Manage Users</h5>
            <p className="small text-secondary mb-0">View user details, edit profiles, or revoke user access.</p>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/bookings" className="btn btn-dark border-secondary p-4 w-100 text-start rounded-3 h-100 shadow-sm text-decoration-none">
            <span className="fs-2 mb-2 d-block">📋</span>
            <h5 className="fw-bold text-white mb-1">Manage Bookings</h5>
            <p className="small text-secondary mb-0">Review booking statuses, confirm trips, or cancel active bookings.</p>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/acabs" className="btn btn-dark border-secondary p-4 w-100 text-start rounded-3 h-100 shadow-sm text-decoration-none">
            <span className="fs-2 mb-2 d-block">🚗</span>
            <h5 className="fw-bold text-white mb-1">Manage Cabs</h5>
            <p className="small text-secondary mb-0">List registered cabs, update availability status, or edit prices.</p>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/addcar" className="btn btn-dark border-secondary p-4 w-100 text-start rounded-3 h-100 shadow-sm text-decoration-none">
            <span className="fs-2 mb-2 d-block">➕</span>
            <h5 className="fw-bold text-white mb-1">Add New Cab</h5>
            <p className="small text-secondary mb-0">Register a new vehicle with plate number, seat count, and driver info.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ahome;
