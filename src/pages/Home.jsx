// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllListings } from "../store/slices/listingSlice";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const { listings, loading } = useSelector((state) => state.listings);

  const [filters, setFilters] = useState({
    city: "",
    type: "",
    maxRent: "",
    roomType: "",
  });

  useEffect(() => {
    dispatch(getAllListings(filters));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllListings(filters));
  };

  const handleReset = () => {
    setFilters({ city: "", type: "", maxRent: "", roomType: "" });
    dispatch(getAllListings({}));
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Find Your Perfect Roommate</h1>
        <p>
          Connect with like-minded people and discover your ideal living space
        </p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="City (e.g., Lucknow)"
            className="search-input"
          />

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="search-input"
          >
            <option value="">All Types</option>
            <option value="Room Available">Room Available</option>
            <option value="Looking for Room">Looking for Room</option>
            <option value="Looking for Roommate">Looking for Roommate</option>
          </select>

          <select
            name="roomType"
            value={filters.roomType}
            onChange={handleFilterChange}
            className="search-input"
          >
            <option value="">Room Type</option>
            <option value="Private">Private</option>
            <option value="Shared">Shared</option>
            <option value="Studio">Studio</option>
            <option value="Apartment">Apartment</option>
          </select>

          <input
            type="number"
            name="maxRent"
            value={filters.maxRent}
            onChange={handleFilterChange}
            placeholder="Max Rent"
            className="search-input"
          />

          <button type="submit" className="search-btn">
            Search
          </button>
          <button type="button" onClick={handleReset} className="reset-btn">
            Reset
          </button>
        </form>
      </div>

      <div className="listings-section">
        <h2>Available Listings ({listings.length})</h2>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="no-listings">
            <p>No listings found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <Link
                to={`/listing/${listing._id}`}
                key={listing._id}
                className="listing-card"
              >
                <div className="listing-badge">{listing.type}</div>
                <h3>{listing.title}</h3>
                <p className="listing-location">
                  📍 {listing.location.city}, {listing.location.state}
                </p>
                <p className="listing-rent">₹{listing.rent}/month</p>
                <div className="listing-details">
                  <span className="detail-badge">{listing.roomType}</span>
                  {listing.amenities.wifi && (
                    <span className="detail-badge">📶 WiFi</span>
                  )}
                  {listing.amenities.ac && (
                    <span className="detail-badge">❄️ AC</span>
                  )}
                  {listing.amenities.parking && (
                    <span className="detail-badge">🚗 Parking</span>
                  )}
                </div>
                <p className="listing-description">
                  {listing.description.substring(0, 100)}...
                </p>
                <div className="listing-footer">
                  <span>👁️ {listing.views} views</span>
                  <span className="view-btn">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
