import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Addcar = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    pricePerKm: '',
    description: '',
    numberPlate: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please upload a cab image.');
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('type', formData.type);
      data.append('pricePerKm', formData.pricePerKm);
      data.append('description', formData.description);
      data.append('numberPlate', formData.numberPlate);
      data.append('image', imageFile);

      await api.post('/cars', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/acabs');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to register the cab.');
      setSaving(false);
    }
  };

  return (
    <div className="text-light">
      <div className="mb-4">
        <Link to="/acabs" className="btn btn-outline-secondary btn-sm">← Back to Cabs</Link>
      </div>

      <div className="card bg-dark text-light border-secondary shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '600px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h2 className="fw-bold mb-4 text-center">Add New Cab to Fleet</h2>
        
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-secondary">Vehicle / Model Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              name="name"
              placeholder="e.g. Toyota Camry"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small text-secondary">Vehicle Type</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small text-secondary">Price per KM ($)</label>
              <input
                type="number"
                className="form-control bg-dark text-light border-secondary"
                name="pricePerKm"
                step="0.01"
                min="0.01"
                placeholder="e.g. 2.50"
                value={formData.pricePerKm}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small text-secondary">Plate Number</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              name="numberPlate"
              placeholder="e.g. NYC-1234"
              value={formData.numberPlate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small text-secondary">Description / Seats Details</label>
            <textarea
              className="form-control bg-dark text-light border-secondary"
              name="description"
              rows="3"
              placeholder="e.g. Comfortable 5-seater sedan, clean interior, air-conditioned."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label small text-secondary">Vehicle Image</label>
            {imagePreview && (
              <div className="mb-2 text-center">
                <img src={imagePreview} alt="Preview" className="rounded border border-secondary" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }} />
              </div>
            )}
            <input
              type="file"
              className="form-control bg-dark text-light border-secondary"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger btn-lg w-100 fw-bold shadow"
            disabled={saving}
          >
            {saving ? 'Adding Cab...' : 'Add Cab to Fleet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addcar;
