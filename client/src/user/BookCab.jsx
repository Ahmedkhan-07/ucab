import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { ASSET_URL } from '../api';

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

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  const [addDonation, setAddDonation] = useState(false);
  const [refreshments, setRefreshments] = useState({
    water: false,
    snack: false,
  });

  const handleApplyPromo = () => {
    setPromoError('');
    const validCodes = ['WELCOME10', 'DISCOUNT10', 'AIRPORT20'];
    if (validCodes.includes(promoCode)) {
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promo code. Try DISCOUNT10 or AIRPORT20.');
    }
  };

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
      const refreshmentsArray = [];
      if (refreshments.water) refreshmentsArray.push('water');
      if (refreshments.snack) refreshmentsArray.push('snack');

      const payload = {
        carId: id,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        distance: Number(formData.distance),
        discountCode: promoApplied ? promoCode : '',
        donationAmount: addDonation ? 2.00 : 0,
        refreshments: refreshmentsArray,
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

  const basePrice = cab && formData.distance ? Number(cab.pricePerKm) * Number(formData.distance) : 0;
  const discountAmount = promoApplied ? basePrice * (promoCode === 'AIRPORT20' ? 0.2 : 0.1) : 0;
  const donationAmount = addDonation ? 2.00 : 0;
  const refreshmentsPrice = (refreshments.water ? 1.50 : 0) + (refreshments.snack ? 3.50 : 0);
  const estimatedPrice = (basePrice - discountAmount + donationAmount + refreshmentsPrice).toFixed(2);

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
          <div className="glass-card overflow-hidden h-100">
            {cab.image ? (
              <img
                src={`${ASSET_URL}${cab.image}`}
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
                <i className="bi bi-car-front-fill fs-1 text-dark"></i>
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
          <div className="glass-card p-4">
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

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Promo Code</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="e.g. DISCOUNT10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={promoApplied}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {promoError && <div className="text-danger small mt-1">{promoError}</div>}
                  {promoApplied && <div className="text-success small mt-1">Promo applied ({promoCode === 'AIRPORT20' ? '20%' : '10%'} discount)</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary">Carbon Offset</label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="greenDonation"
                      checked={addDonation}
                      onChange={(e) => setAddDonation(e.target.checked)}
                    />
                    <label className="form-check-label small text-secondary" htmlFor="greenDonation">
                      Add $2.00 Green Donation
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary d-block">In-Cabin Refreshments (Optional)</label>
                <div className="form-check form-check-inline me-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="waterCheck"
                    checked={refreshments.water}
                    onChange={(e) => setRefreshments({ ...refreshments, water: e.target.checked })}
                  />
                  <label className="form-check-label small text-secondary" htmlFor="waterCheck">
                    Cold Water Bottle (+$1.50)
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="snackCheck"
                    checked={refreshments.snack}
                    onChange={(e) => setRefreshments({ ...refreshments, snack: e.target.checked })}
                  />
                  <label className="form-check-label small text-secondary" htmlFor="snackCheck">
                    Soda & Snack Pack (+$3.50)
                  </label>
                </div>
              </div>

              {formData.distance && (
                <div className="p-3 rounded-3 bg-secondary bg-opacity-25 border border-secondary mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <span className="text-secondary small d-block">Estimated Fare:</span>
                      <span className="text-muted small">
                        ({formData.distance} km × ${cab?.pricePerKm}/km)
                        {promoApplied && ` - ${promoCode === 'AIRPORT20' ? '20%' : '10%'} off`}
                        {addDonation && ' + $2.00 donation'}
                        {(refreshments.water || refreshments.snack) && ` + $${((refreshments.water ? 1.50 : 0) + (refreshments.snack ? 3.50 : 0)).toFixed(2)} refreshments`}
                      </span>
                    </div>
                    <span className="text-primary fw-bold fs-3">${estimatedPrice}</span>
                  </div>
                  <div className="border-top border-secondary pt-2 mt-2">
                    <span className="text-info small d-block">
                      <i className="bi bi-clock-history me-1"></i> Driver is nearby and can arrive in approx. 5 minutes.
                    </span>
                    <span className="text-muted small d-block mt-1">
                      <i className="bi bi-credit-card-2-back me-1"></i> Auto-pay Enabled: Saved Visa (**** 9876) will be charged automatically upon trip confirmation.
                    </span>
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
