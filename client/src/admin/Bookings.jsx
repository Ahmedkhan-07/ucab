import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings. Ensure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoading(true);
    setError('');
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update booking status.');
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
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-danger">Loading bookings list...</p>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Bookings Administration</h2>
        <Link to="/ahome" className="btn btn-outline-secondary btn-sm">Back to Dashboard</Link>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {bookings.length === 0 ? (
        <div className="alert alert-info bg-dark border-secondary text-center py-4">No bookings found in the system.</div>
      ) : (
        <div className="card bg-dark border-secondary shadow-sm rounded-4 overflow-hidden" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th className="border-secondary text-secondary ps-4">User</th>
                  <th className="border-secondary text-secondary">Vehicle Details</th>
                  <th className="border-secondary text-secondary">Route / Time</th>
                  <th className="border-secondary text-secondary text-center">Distance</th>
                  <th className="border-secondary text-secondary text-end">Price</th>
                  <th className="border-secondary text-secondary text-center">Status</th>
                  <th className="border-secondary text-secondary text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="ps-4">
                      <div className="fw-semibold text-warning">{booking.user?.name || 'Unknown User'}</div>
                      <div className="text-secondary small">{booking.user?.email || 'N/A'}</div>
                      <div className="text-secondary small">{booking.user?.phone || ''}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{booking.car?.name || 'Cab'}</div>
                      <div className="text-secondary small">{booking.car?.type} ({booking.car?.numberPlate})</div>
                    </td>
                    <td>
                      <div className="small">From: <strong>{booking.pickupLocation}</strong></div>
                      <div className="small">To: <strong>{booking.dropLocation}</strong></div>
                      <div className="text-secondary small mt-1">
                        {new Date(booking.bookingDate).toLocaleDateString()} @ {booking.bookingTime}
                      </div>
                    </td>
                    <td className="text-center">{booking.distance} km</td>
                    <td className="text-end fw-semibold text-success">${booking.totalPrice?.toFixed(2)}</td>
                    <td className="text-center">{getStatusBadge(booking.status)}</td>
                    <td className="text-center pe-4">
                      {booking.status === 'pending' && (
                        <div className="btn-group">
                          <button
                            className="btn btn-success btn-sm fw-semibold"
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                            disabled={actionLoading}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          className="btn btn-primary btn-sm fw-semibold"
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                          disabled={actionLoading}
                        >
                          Complete
                        </button>
                      )}
                      {booking.status === 'completed' && <span className="text-success small">Completed</span>}
                      {booking.status === 'cancelled' && <span className="text-danger small">Cancelled</span>}
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

export default Bookings;
