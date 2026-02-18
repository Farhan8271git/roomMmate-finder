// frontend/src/pages/MyListings.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyListings, deleteListing } from '../store/slices/listingSlice';
import './MyListings.css';

function MyListings() {
  const dispatch = useDispatch();
  const { myListings, loading } = useSelector((state) => state.listings);

  useEffect(() => {
    dispatch(getMyListings());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      dispatch(deleteListing(id));
    }
  };

  return (
    <div className="my-listings-container">
      <div className="my-listings-header">
        <h1>My Listings</h1>
        <Link to="/create-listing" className="create-btn">
          + Create New Listing
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : myListings.length === 0 ? (
        <div className="empty-state">
          <h2>No listings yet</h2>
          <p>Create your first listing to get started!</p>
          <Link to="/create-listing" className="create-btn">
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="listings-list">
          {myListings.map((listing) => (
            <div key={listing._id} className="my-listing-card">
              <div className="listing-content">
                <div className="listing-info">
                  <span className={`status-badge ${listing.status.toLowerCase()}`}>
                    {listing.status}
                  </span>
                  <h3>{listing.title}</h3>
                  <p className="location">
                    📍 {listing.location.city}, {listing.location.state}
                  </p>
                  <p className="rent">₹{listing.rent}/month</p>
                  <div className="listing-meta">
                    <span>👁️ {listing.views} views</span>
                    <span>💬 {listing.interested.length} interested</span>
                  </div>
                </div>
                <div className="listing-actions">
                  <Link to={`/listing/${listing._id}`} className="action-btn view">
                    View
                  </Link>
                  <button 
                    onClick={() => handleDelete(listing._id)} 
                    className="action-btn delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;