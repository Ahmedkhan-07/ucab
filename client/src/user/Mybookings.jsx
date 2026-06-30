import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Mybookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/mybookings');
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setActionLoading(true);
    setError('');
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      fetchBookings();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to cancel the booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'confirmed':
        return <span className="badge bg-primary">Confirmed</span>;
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Bookings</h2>
        <Link to="/uhome" className="btn btn-outline-secondary btn-sm">Back to Dashboard</Link>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {bookings.length === 0 ? (
        <div className="card bg-dark border-secondary p-5 text-center text-secondary rounded-4" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <span className="fs-1 mb-3">📅</span>
          <h4>No rides booked yet</h4>
          <p className="small mb-4">Book your first cab today and enjoy premium rides.</p>
          <div>
            <Link to="/cabs" className="btn btn-primary px-4 fw-semibold shadow">Book a Cab</Link>
          </div>
        </div>
      ) : (
        <div className="card bg-dark border-secondary shadow-sm rounded-4 overflow-hidden" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th className="border-secondary text-secondary ps-4">Date & Time</th>
                  <th className="border-secondary text-secondary">Cab / Vehicle</th>
                  <th className="border-secondary text-secondary">Route</th>
                  <th className="border-secondary text-secondary text-center">Distance</th>
                  <th className="border-secondary text-secondary text-end">Total Price</th>
                  <th className="border-secondary text-secondary text-center">Status</th>
                  <th className="border-secondary text-secondary text-center pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="ps-4">
                      <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                      <div className="text-secondary small">{booking.bookingTime}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{booking.car?.name || 'Cab'}</div>
                      <div className="text-secondary small">{booking.car?.type} ({booking.car?.numberPlate})</div>
                    </td>
                    <td>
                      <div>From: <strong className="small text-secondary">{booking.pickupLocation}</strong></div>
                      <div>To: <strong className="small text-secondary">{booking.dropLocation}</strong></div>
                    </td>
                    <td className="text-center">{booking.distance} km</td>
                    <td className="text-end fw-semibold text-success">${booking.totalPrice?.toFixed(2)}</td>
                    <td className="text-center">{getStatusBadge(booking.status)}</td>
                    <td className="text-center pe-4">
                      {booking.status === 'pending' ? (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(booking._id)}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mybookings;
