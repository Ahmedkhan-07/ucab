import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const { name, email, phone, role } = response.data;
        setFormData({
          name: name || '',
          email: email || '',
          phone: phone || '',
          role: role || 'user',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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
    setSaving(true);

    try {
      await api.put(`/users/${id}`, formData);
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update user.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-danger">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="mb-4">
        <Link to="/users" className="btn btn-outline-secondary btn-sm">← Back to Users</Link>
      </div>

      <div className="glass-card p-4 mx-auto" style={{ maxWidth: '600px', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
        <h2 className="fw-bold mb-4 text-center">Edit User Profile</h2>
        
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

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

          <div className="mb-3">
            <label className="form-label small text-secondary">Phone Number</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small text-secondary">System Role</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-danger btn-lg w-100 fw-bold shadow"
            disabled={saving}
          >
            {saving ? 'Saving Changes...' : 'Save User Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
