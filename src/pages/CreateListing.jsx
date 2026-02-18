// frontend/src/pages/CreateListing.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../store/slices/listingSlice';
import './CreateListing.css';

function CreateListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.listings);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Room Available',
    roomType: 'Private',
    rent: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPhone: user?.phone || '',
    availableFrom: '',
    wifi: false,
    ac: false,
    parking: false,
    kitchen: false,
    laundry: false,
    furnished: false,
    gender: 'Any',
    smoking: false,
    pets: false,
    vegetarian: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const listingData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      roomType: formData.roomType,
      rent: Number(formData.rent),
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      amenities: {
        wifi: formData.wifi,
        ac: formData.ac,
        parking: formData.parking,
        kitchen: formData.kitchen,
        laundry: formData.laundry,
        furnished: formData.furnished
      },
      preferences: {
        gender: formData.gender,
        smoking: formData.smoking,
        pets: formData.pets,
        vegetarian: formData.vegetarian
      },
      availableFrom: formData.availableFrom,
      contactPhone: formData.contactPhone
    };

    dispatch(createListing(listingData)).then((result) => {
      if (result.type === 'listings/create/fulfilled') {
        alert('Listing created successfully!');
        navigate('/my-listings');
      }
    });
  };

  return (
    <div className="create-listing-container">
      <div className="create-listing-card">
        <h1>Create New Listing 📝</h1>
        <p className="subtitle">Fill in the details to post your listing</p>

        <form onSubmit={handleSubmit} className="create-listing-form">
          <section className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Spacious 2BHK in Gomti Nagar"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your listing..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Listing Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="Room Available">Room Available</option>
                  <option value="Looking for Room">Looking for Room</option>
                  <option value="Looking for Roommate">Looking for Roommate</option>
                </select>
              </div>

              <div className="form-group">
                <label>Room Type *</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange} required>
                  <option value="Private">Private</option>
                  <option value="Shared">Shared</option>
                  <option value="Studio">Studio</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Rent (₹/month) *</label>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  placeholder="5000"
                  required
                  min="0"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Location</h2>
            
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Lucknow"
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Uttar Pradesh"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="226010"
                  required
                  pattern="[0-9]{6}"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Amenities</h2>
            <div className="checkbox-grid">
              <label className="checkbox-label">
                <input type="checkbox" name="wifi" checked={formData.wifi} onChange={handleChange} />
                📶 WiFi
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="ac" checked={formData.ac} onChange={handleChange} />
                ❄️ AC
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} />
                🚗 Parking
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="kitchen" checked={formData.kitchen} onChange={handleChange} />
                🍳 Kitchen
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="laundry" checked={formData.laundry} onChange={handleChange} />
                🧺 Laundry
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} />
                🛋️ Furnished
              </label>
            </div>
          </section>

          <section className="form-section">
            <h2>Preferences</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Gender Preference</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="checkbox-grid">
              <label className="checkbox-label">
                <input type="checkbox" name="smoking" checked={formData.smoking} onChange={handleChange} />
                🚬 Smoking Allowed
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="pets" checked={formData.pets} onChange={handleChange} />
                🐕 Pets Allowed
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="vegetarian" checked={formData.vegetarian} onChange={handleChange} />
                🥗 Vegetarian Only
              </label>
            </div>
          </section>
          
          <section className="form-section">
            <h2>Contact & Availability</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="form-group">
                <label>Available From *</label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;