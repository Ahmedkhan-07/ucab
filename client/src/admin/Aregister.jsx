import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Aregister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/admin/register', formData);
      const { token, _id, name, email } = response.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminId', _id);
      localStorage.setItem('adminName', name);
      localStorage.setItem('adminEmail', email);

      setSuccess('Admin registered successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/ahome');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to register admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="glass-card p-4 w-100" style={{ maxWidth: '450px', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
        <div className="card-body">
          <h2 className="card-title fw-bold text-danger text-center mb-4">Admin Registration</h2>
          
          {error && <div className="alert alert-danger mb-3 py-2 small">{error}</div>}
          {success && <div className="alert alert-success mb-3 py-2 small">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-secondary">Full Name</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center small text-secondary mt-3 mb-0">
            Already have an admin account? <Link to="/alogin" className="text-danger fw-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aregister;
