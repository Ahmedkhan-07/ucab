import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Mybookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState(null);

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
          <i className="bi bi-calendar-x fs-1 text-secondary mb-3 d-block"></i>
          <h4>No rides booked yet</h4>
          <p className="small mb-4">Book your first cab today and enjoy premium rides.</p>
          <div>
            <Link to="/cabs" className="btn btn-primary px-4 fw-semibold shadow">Book a Cab</Link>
          </div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
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
                      <div className="d-flex justify-content-center align-items-center">
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            className="btn btn-outline-info btn-sm me-2"
                            onClick={() => setActiveTrackingBooking(booking)}
                          >
                            Track
                          </button>
                        )}
                        {booking.status === 'pending' ? (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleCancel(booking._id)}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        ) : booking.status !== 'confirmed' ? (
                          <span className="text-muted small">-</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTrackingBooking && (
        <div className="card bg-dark text-light border-info mt-4 p-4 rounded-4 shadow-lg" style={{ border: '1px solid rgba(13, 202, 240, 0.4)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold text-info mb-0">
              <i className="bi bi-geo-alt-fill me-2"></i>Live Ride Tracking
            </h4>
            <button 
              className="btn-close btn-close-white" 
              onClick={() => setActiveTrackingBooking(null)}
            ></button>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 bg-secondary bg-opacity-10 border border-secondary rounded-3 h-100">
                <h5 className="fw-bold text-primary mb-1">{activeTrackingBooking.car?.name || 'Cab'}</h5>
                <p className="small text-secondary mb-3">{activeTrackingBooking.car?.type || 'Standard'} &bull; {activeTrackingBooking.car?.numberPlate || 'N/A'}</p>
                
                <div className="d-flex justify-content-between small border-top border-secondary pt-2 mt-2">
                  <span className="text-secondary">Pickup Location:</span>
                  <span className="fw-semibold">{activeTrackingBooking.pickupLocation}</span>
                </div>
                <div className="d-flex justify-content-between small mt-1">
                  <span className="text-secondary">Drop-off Location:</span>
                  <span className="fw-semibold">{activeTrackingBooking.dropLocation}</span>
                </div>
                <div className="d-flex justify-content-between small mt-1 border-top border-secondary pt-2">
                  <span className="text-secondary">Base Fare:</span>
                  <span className="fw-semibold">${(activeTrackingBooking.totalPrice - (activeTrackingBooking.donation || 0) - (activeTrackingBooking.refreshmentsPrice || 0) + (activeTrackingBooking.discount || 0)).toFixed(2)}</span>
                </div>
                {activeTrackingBooking.discount > 0 && (
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Discount applied:</span>
                    <span>-${activeTrackingBooking.discount.toFixed(2)}</span>
                  </div>
                )}
                {activeTrackingBooking.donation > 0 && (
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Green Donation:</span>
                    <span>+${activeTrackingBooking.donation.toFixed(2)}</span>
                  </div>
                )}
                {activeTrackingBooking.refreshmentsPrice > 0 && (
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Refreshments ({activeTrackingBooking.refreshments?.join(', ')}):</span>
                    <span>+${activeTrackingBooking.refreshmentsPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small mt-1 border-top border-secondary pt-2">
                  <span className="text-secondary fw-semibold">Charged Amount:</span>
                  <span className="fw-bold text-success">${activeTrackingBooking.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-secondary bg-opacity-10 border border-secondary rounded-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge bg-info text-dark mb-2">Live Status</span>
                  <h5 className="fw-bold text-white mb-2">
                    {activeTrackingBooking.status === 'pending' 
                      ? 'Waiting for Driver to Accept' 
                      : 'Driver is Arriving to your Location'}
                  </h5>
                  <div className="progress bg-dark border border-secondary mt-3" style={{ height: '22px', borderRadius: '11px' }}>
                    <div 
                      className={`progress-bar progress-bar-striped progress-bar-animated ${activeTrackingBooking.status === 'pending' ? 'bg-warning' : 'bg-info'}`}
                      role="progressbar" 
                      style={{ width: activeTrackingBooking.status === 'pending' ? '25%' : '65%' }}
                      aria-valuenow={activeTrackingBooking.status === 'pending' ? 25 : 65} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {activeTrackingBooking.status === 'pending' ? 'Assigning driver...' : 'Arriving in ~3 minutes'}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-muted small mb-1">
                    <i className="bi bi-credit-card-2-back text-secondary me-1"></i> Auto-payment authorized via {activeTrackingBooking.paymentMethod || 'Saved Visa (**** 9876)'}.
                  </div>
                  <div className="text-muted small">
                    <i className="bi bi-shield-check text-success me-1"></i> You are fully covered by Sarah's urgent travel guarantee.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mybookings;
