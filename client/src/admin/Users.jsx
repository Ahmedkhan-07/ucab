import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users. Ensure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    setActionLoading(true);
    setError('');
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete user.');
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
        <p className="mt-2 text-danger">Loading users list...</p>
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">User Administration</h2>
        <Link to="/ahome" className="btn btn-outline-secondary btn-sm">Back to Dashboard</Link>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {users.length === 0 ? (
        <div className="alert alert-info bg-dark border-secondary text-center py-4">No users found in the system.</div>
      ) : (
        <div className="card bg-dark border-secondary shadow-sm rounded-4 overflow-hidden" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th className="border-secondary text-secondary ps-4">User Details</th>
                  <th className="border-secondary text-secondary">Email</th>
                  <th className="border-secondary text-secondary">Phone</th>
                  <th className="border-secondary text-secondary text-center">Role</th>
                  <th className="border-secondary text-secondary text-center">Registered Date</th>
                  <th className="border-secondary text-secondary text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="ps-4">
                      <div className="fw-semibold text-primary">{user.name}</div>
                      <div className="text-secondary small">ID: {user._id}</div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || <span className="text-muted small">Not Provided</span>}</td>
                    <td className="text-center">
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-center pe-4">
                      <div className="btn-group">
                        <Link to={`/users/${user._id}`} className="btn btn-outline-info btn-sm">
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(user._id)}
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

export default Users;
