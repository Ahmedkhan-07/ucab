import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { ASSET_URL } from '../api';

const Acabs = () => {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCabs = async () => {
    try {
      const response = await api.get('/cars');
      setCabs(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch cabs list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabs();
  }, []);

  const handleDelete = async (cabId) => {
    if (!window.confirm('Are you sure you want to delete this cab?')) return;
    
    setActionLoading(true);
    setError('');
    try {
      await api.delete(`/cars/${cabId}`);
      fetchCabs();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete cab.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-danger">Loading cabs list...</p>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Cab Fleet Administration</h2>
        <div className="btn-group">
          <Link to="/addcar" className="btn btn-danger btn-sm">Add New Cab</Link>
          <Link to="/ahome" className="btn btn-outline-secondary btn-sm">Back to Dashboard</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {cabs.length === 0 ? (
        <div className="alert alert-info bg-dark border-secondary text-center py-4">No cabs registered in the system.</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th className="border-secondary text-secondary ps-4">Vehicle Details</th>
                  <th className="border-secondary text-secondary text-center">Type</th>
                  <th className="border-secondary text-secondary text-center">Plate Number</th>
                  <th className="border-secondary text-secondary text-end">Price / KM</th>
                  <th className="border-secondary text-secondary text-center">Status</th>
                  <th className="border-secondary text-secondary text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cabs.map((cab) => (
                  <tr key={cab._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        {cab.image ? (
                          <img
                            src={`${ASSET_URL}${cab.image}`}
                            alt={cab.name}
                            className="rounded-3 me-3"
                            style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=60&q=80';
                            }}
                          />
                        ) : (
                          <div className="bg-secondary rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '40px' }}>
                            <i className="bi bi-car-front-fill text-dark"></i>
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold text-primary">{cab.name}</div>
                          <div className="text-secondary small">{cab.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{cab.type}</td>
                    <td className="text-center">{cab.numberPlate}</td>
                    <td className="text-end fw-semibold text-success">${cab.pricePerKm?.toFixed(2)}</td>
                    <td className="text-center">
                      <span className={`badge ${cab.available ? 'bg-success' : 'bg-danger'}`}>
                        {cab.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="text-center pe-4">
                      <div className="btn-group">
                        <Link to={`/acabs/${cab._id}`} className="btn btn-outline-info btn-sm">
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(cab._id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </div>
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

export default Acabs;
