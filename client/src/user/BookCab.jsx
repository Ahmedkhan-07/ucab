import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const BookCab = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cab, setCab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    bookingDate: '',
    bookingTime: '',
    distance: '',
  });

  useEffect(() => {
    const fetchCab = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCab(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch cab details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCab();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        carId: id,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        distance: Number(formData.distance),
      };

      await api.post('/bookings', payload);
      navigate('/mybookings');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedPrice = cab && formData.distance ? (Number(cab.pricePerKm) * Number(formData.distance)).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading cab details...</p>
      </div>
    );
  }

  if (error && !cab) {
    return (
      <div className="container py-4 text-light text-center">
        <div className="alert alert-danger">{error}</div>
        <Link to="/cabs" className="btn btn-primary">Back to Cabs</Link>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="mb-4">
        <Link to="/cabs" className="btn btn-outline-secondary btn-sm">← Back to Cabs</Link>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card bg-dark text-light border-secondary shadow-sm rounded-4 overflow-hidden h-100" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {cab.image ? (
              <img
                src={`http://localhost:5000${cab.image}`}
                alt={cab.name}
                className="card-img-top"
                style={{ height: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
                }}
              />
            ) : (
              <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                <span className="text-dark fs-1">🚕</span>
              </div>
            )}
            <div className="card-body p-4">
              <h3 className="fw-bold mb-1 text-primary">{cab.name}</h3>
              <p className="badge bg-secondary mb-3">{cab.type}</p>
              
              <div className="mb-3">
                <span className="text-secondary d-block small">Plate Number:</span>
                <span className="fw-semibold">{cab.numberPlate}</span>
              </div>

              <div className="mb-3">
                <span className="text-secondary d-block small">Price per Kilometer:</span>
                <span className="fw-bold text-success fs-5">${cab.pricePerKm}</span>
              </div>

              <div className="mb-0">
                <span className="text-secondary d-block small">Description:</span>
                <p className="text-secondary small">{cab.description || 'Enjoy a clean, comfortable, and air-conditioned ride with an experienced driver.'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card bg-dark text-light border-secondary shadow-sm rounded-4 p-4" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h2 className="fw-bold mb-4">Book Your Ride</h2>
            
            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Pickup Location</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    name="pickupLocation"
                    placeholder="e.g. Times Square"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Drop Location</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    name="dropLocation"
                    placeholder="e.g. JFK Airport"
                    value={formData.dropLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Booking Date</label>
                  <input
                    type="date"
                    className="form-control bg-dark text-light border-secondary"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Booking Time</label>
                  <input
                    type="time"
                    className="form-control bg-dark text-light border-secondary"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary">Estimated Distance (in Kilometers)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-light border-secondary"
                  name="distance"
                  placeholder="e.g. 15"
                  min="1"
                  value={formData.distance}
                  onChange={handleChange}
                  required
                />
              </div>

              {formData.distance && (
                <div className="p-3 rounded-3 bg-secondary bg-opacity-25 border border-secondary mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-secondary small d-block">Estimated Fare:</span>
                      <span className="text-muted small">({formData.distance} km × ${cab?.pricePerKm}/km)</span>
                    </div>
                    <span className="text-primary fw-bold fs-3">${estimatedPrice}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-bold shadow"
                disabled={submitting}
              >
                {submitting ? 'Confirming Booking...' : 'Book Ride'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCab;
