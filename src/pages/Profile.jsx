// frontend/src/pages/Profile.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import './Profile.css';

function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    occupation: user?.occupation || '',
    bio: user?.bio || '',
    location: user?.preferences?.location || '',
    budgetMin: user?.preferences?.budget?.min || '',
    budgetMax: user?.preferences?.budget?.max || '',
    roomType: user?.preferences?.roomType || 'Any',
    smoking: user?.preferences?.smoking || false,
    pets: user?.preferences?.pets || false,
    vegetarian: user?.preferences?.vegetarian || false
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
    
    const updateData = {
      name: formData.name,
      phone: formData.phone,
      age: Number(formData.age),
      occupation: formData.occupation,
      bio: formData.bio,
      preferences: {
        location: formData.location,
        budget: {
          min: Number(formData.budgetMin),
          max: Number(formData.budgetMax)
        },
        roomType: formData.roomType,
        smoking: formData.smoking,
        pets: formData.pets,
        vegetarian: formData.vegetarian
      }
    };

    dispatch(updateProfile(updateData)).then((result) => {
      if (result.type === 'auth/updateProfile/fulfilled') {
        alert('Profile updated successfully!');
        setIsEditing(false);
      }
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user?.avatar} alt={user?.name} className="profile-avatar" />
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <p>{user?.age} years • {user?.gender}</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="edit-btn"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <section className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Living Preferences</h2>
              
              <div className="form-group">
                <label>Preferred Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Gomti Nagar, Lucknow"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Budget Min (₹)</label>
                  <input
                    type="number"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Budget Max (₹)</label>
                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Room Type Preference</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange}>
                  <option value="Any">Any</option>
                  <option value="Private">Private</option>
                  <option value="Shared">Shared</option>
                </select>
              </div>

              <div className="checkbox-grid">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="smoking"
                    checked={formData.smoking}
                    onChange={handleChange}
                  />
                  🚬 Smoking OK
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="pets"
                    checked={formData.pets}
                    onChange={handleChange}
                  />
                  🐕 Pets OK
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={formData.vegetarian}
                    onChange={handleChange}
                  />
                  🥗 Vegetarian
                </label>
              </div>
            </section>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="profile-view">
            <section className="view-section">
              <h2>About</h2>
              <p>{user?.bio || 'No bio added yet.'}</p>
              {user?.occupation && (
                <p><strong>Occupation:</strong> {user.occupation}</p>
              )}
            </section>

            <section className="view-section">
              <h2>Contact</h2>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </section>

            {user?.preferences && (
              <section className="view-section">
                <h2>Living Preferences</h2>
                {user.preferences.location && (
                  <p><strong>Location:</strong> {user.preferences.location}</p>
                )}
                {user.preferences.budget && (
                  <p><strong>Budget:</strong> ₹{user.preferences.budget.min} - ₹{user.preferences.budget.max}</p>
                )}
                {user.preferences.roomType && (
                  <p><strong>Room Type:</strong> {user.preferences.roomType}</p>
                )}
                <div className="preference-tags">
                  {user.preferences.smoking && <span className="tag">🚬 Smoking OK</span>}
                  {user.preferences.pets && <span className="tag">🐕 Pets OK</span>}
                  {user.preferences.vegetarian && <span className="tag">🥗 Vegetarian</span>}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;