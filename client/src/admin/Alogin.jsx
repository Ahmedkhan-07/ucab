import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Alogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/login', formData);
      const { token, _id, name, email } = response.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminId', _id);
      localStorage.setItem('adminName', name);
      localStorage.setItem('adminEmail', email);

      navigate('/ahome');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="glass-card p-4 w-100" style={{ maxWidth: '450px', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
        <div className="card-body">
          <h2 className="card-title fw-bold text-danger text-center mb-4">Admin Login</h2>
          
          {error && <div className="alert alert-danger mb-3 py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-secondary">Email Address</label>
              <input
                type="email"
                className="form-control bg-dark text-light border-secondary"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label small text-secondary">Password</label>
              <input
                type="password"
                className="form-control bg-dark text-light border-secondary"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-danger btn-lg w-100 mb-3 fw-bold shadow" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center small text-secondary mt-3 mb-0">
            Need admin access? <Link to="/aregister" className="text-danger fw-semibold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alogin;
