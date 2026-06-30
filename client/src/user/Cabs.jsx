import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { ASSET_URL } from '../api';

const Cabs = () => {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await api.get('/cars');
        setCabs(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch cabs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCabs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading available cabs...</p>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Available Cabs</h2>
        <Link to="/uhome" className="btn btn-outline-secondary btn-sm">Back to Dashboard</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {cabs.length === 0 ? (
        <div className="alert alert-info text-center py-4 bg-dark border-secondary">No cabs found in the database.</div>
      ) : (
        <div className="row g-4">
          {cabs.map((cab) => (
            <div className="col-md-4" key={cab._id}>
              <div className="glass-card h-100 overflow-hidden">
                {cab.image ? (
                  <img
                    src={`${ASSET_URL}${cab.image}`}
                    alt={cab.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                ) : (
                  <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    <i className="bi bi-car-front-fill fs-1 text-dark"></i>
                  </div>
                )}
                <div className="card-body d-flex flex-column justify-content-between p-4">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="card-title fw-bold mb-0">{cab.name}</h4>
                      <span className={`badge ${cab.available ? 'bg-success' : 'bg-danger'}`}>
                        {cab.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    <p className="text-secondary small mb-3">Type: <span className="text-light">{cab.type}</span> | Plate: <span className="text-light">{cab.numberPlate}</span></p>
                    <p className="card-text text-secondary mb-4 small">{cab.description || 'Enjoy a clean, comfortable, and air-conditioned ride with an experienced driver.'}</p>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-secondary">Price per KM:</span>
                      <span className="text-primary fw-bold fs-4">${cab.pricePerKm}</span>
                    </div>
                    
                    {cab.available ? (
                      <Link to={`/bookcab/${cab._id}`} className="btn btn-primary w-100 fw-semibold shadow">
                        Book Now
                      </Link>
                    ) : (
                      <button className="btn btn-secondary w-100" disabled>
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cabs;
