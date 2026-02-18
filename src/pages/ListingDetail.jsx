// frontend/src/pages/ListingDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getListingById } from '../store/slices/listingSlice';
import { sendMessage } from '../store/slices/messageSlice';
import './ListingDetail.css';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentListing, loading } = useSelector((state) => state.listings);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);

  useEffect(() => {
    dispatch(getListingById(id));
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(sendMessage({
      receiverId: currentListing.user._id,
      message,
      listingId: currentListing._id
    })).then(() => {
      setMessage('');
      setShowMessageBox(false);
      alert('Message sent successfully!');
    });
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!currentListing) {
    return <div className="error-container">Listing not found</div>;
  }

  const isOwner = user && currentListing.user._id === user.id;

  return (
    <div className="listing-detail-container">
      <div className="listing-detail-content">
        <div className="listing-header">
          <div>
            <span className="listing-type-badge">{currentListing.type}</span>
            <h1>{currentListing.title}</h1>
            <p className="location">
              📍 {currentListing.location.address}, {currentListing.location.city}, {currentListing.location.state} - {currentListing.location.pincode}
            </p>
          </div>
          <div className="listing-price">
            <span className="price-label">Rent</span>
            <span className="price-amount">₹{currentListing.rent}</span>
            <span className="price-period">/month</span>
          </div>
        </div>

        <div className="listing-body">
          <div className="listing-main">
            <section className="detail-section">
              <h2>Description</h2>
              <p>{currentListing.description}</p>
            </section>

            <section className="detail-section">
              <h2>Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Room Type:</span>
                  <span className="detail-value">{currentListing.roomType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Available From:</span>
                  <span className="detail-value">
                    {new Date(currentListing.availableFrom).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${currentListing.status.toLowerCase()}`}>
                    {currentListing.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Views:</span>
                  <span className="detail-value">👁️ {currentListing.views}</span>
                </div>
              </div>
            </section>

            <section className="detail-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {currentListing.amenities.wifi && <span className="amenity-tag">📶 WiFi</span>}
                {currentListing.amenities.ac && <span className="amenity-tag">❄️ AC</span>}
                {currentListing.amenities.parking && <span className="amenity-tag">🚗 Parking</span>}
                {currentListing.amenities.kitchen && <span className="amenity-tag">🍳 Kitchen</span>}
                {currentListing.amenities.laundry && <span className="amenity-tag">🧺 Laundry</span>}
                {currentListing.amenities.furnished && <span className="amenity-tag">🛋️ Furnished</span>}
              </div>
            </section>

            <section className="detail-section">
              <h2>Preferences</h2>
              <div className="preferences-grid">
                <div className="preference-item">
                  <span>Gender Preference:</span>
                  <strong>{currentListing.preferences.gender}</strong>
                </div>
                <div className="preference-item">
                  <span>Smoking:</span>
                  <strong>{currentListing.preferences.smoking ? '✅ Allowed' : '❌ Not Allowed'}</strong>
                </div>
                <div className="preference-item">
                  <span>Pets:</span>
                  <strong>{currentListing.preferences.pets ? '✅ Allowed' : '❌ Not Allowed'}</strong>
                </div>
                <div className="preference-item">
                  <span>Vegetarian:</span>
                  <strong>{currentListing.preferences.vegetarian ? '✅ Yes' : '❌ No'}</strong>
                </div>
              </div>
            </section>
          </div>

          <div className="listing-sidebar">
            <div className="contact-card">
              <h3>Posted By</h3>
              <div className="user-info">
                <img 
                  src={currentListing.user.avatar} 
                  alt={currentListing.user.name}
                  className="user-avatar"
                />
                <div>
                  <h4>{currentListing.user.name}</h4>
                  <p>{currentListing.user.age} years, {currentListing.user.gender}</p>
                  {currentListing.user.occupation && (
                    <p className="occupation">{currentListing.user.occupation}</p>
                  )}
                </div>
              </div>

              {currentListing.user.bio && (
                <p className="user-bio">{currentListing.user.bio}</p>
              )}

              {!isOwner && (
                <>
                  <div className="contact-actions">
                    <a href={`tel:${currentListing.contactPhone}`} className="contact-btn phone">
                      📞 {currentListing.contactPhone}
                    </a>
                    <button 
                      onClick={() => setShowMessageBox(!showMessageBox)}
                      className="contact-btn message"
                    >
                      💬 Send Message
                    </button>
                  </div>

                  {showMessageBox && (
                    <form onSubmit={handleSendMessage} className="message-form">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        required
                        rows="4"
                      />
                      <button type="submit" className="send-btn">Send</button>
                    </form>
                  )}
                </>
              )}

              {isOwner && (
                <div className="owner-badge">
                  ✅ This is your listing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;