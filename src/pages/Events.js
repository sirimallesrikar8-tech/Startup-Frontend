import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Events.css";
import { searchVendorsByName, searchVendorsByLocation } from "../api/vendor.api";
import { Search, MapPin, Star } from "lucide-react";

import hallImg from "../assets/hall.png";
import photographerImg from "../assets/photographer.png";
import decoratorImg from "../assets/decorator.png";
import catererImg from "../assets/caterer.png";
import djImg from "../assets/dj.png";
import hotelImg from "../assets/hotel.png";

const TELANGANA_DISTRICTS = [
  "all", "adilabad", "bhadradri kothagudem", "hanumakonda", "hyderabad",
  "jagtial", "jangaon", "jayashankar bhupalpally", "jogulamba gadwal",
  "kamareddy", "karimnagar", "khammam", "komaram bheem asifabad",
  "mahabubabad", "mahabubnagar", "mancherial", "medak", "medchal–malkajgiri",
  "mulugu", "nagarkurnool", "nalgonda", "narayanpet", "nirmal", "nizamabad",
  "peddapalli", "rajanna sircilla", "rangareddy", "sangareddy", "siddipet",
  "suryapet", "vikarabad", "wanaparthy", "warangal"
];

function Events() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("all");
  const [vendors, setVendors] = useState([]); // Dynamic vendor list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial load - maybe fetch all or just show empty state with a call to action
  // For now, let's try to search with empty string to get some results if the API supports it
  // or default to showing nothing until search.
  // Actually, let's not fetch on mount to keep it clean, or maybe fetch by 'hyderabad' as default?
  // Let's leave it empty and wait for user interaction or fetch 'all' if possible.
  useEffect(() => {
    handleSearch(); // Auto-search on load? Let's try to fetch something.
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      let results = [];
      // If location is selected, prioritize location search
      if (location !== "all") {
        const response = await searchVendorsByLocation(location);
        results = response.data || response; // Adapt based on actual API response structure
      } else if (searchText.trim()) {
        // Fallback to name search
        const response = await searchVendorsByName(searchText);
        results = response.data || response;
      } else {
        // If nothing selected, maybe try a default broad search or just search by 'hyderabad' as a fallback initial view
        // OR if the user just clicked search with empty fields
        // For now, let's try searching 'hall' as a default category if APIs match, or just leave empty.
        // Let's assume the user wants to see *something*.
        // We'll skip fetch if completely empty to avoid errors, or try a generic search
      }

      // Ensure results is an array
      if (Array.isArray(results)) {
        setVendors(results);
      } else {
        // If the API returns something else, handle it (e.g. wrapped in an object)
        setVendors(results.vendors || []);
      }

    } catch (err) {
      console.error("Search failed:", err);
      // We explicitly don't show a visible error to the user for empty results, just empty list
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when Location changes
  useEffect(() => {
    if (location !== "all") {
      handleSearch();
    }
  }, [location]);

  return (
    <div className="container-fluid my-5">
      {/* HERO SECTION with CENTERED SEARCH */}
      <div className="text-center mb-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px', background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)', borderRadius: '0 0 50px 50px', marginTop: '-3rem', paddingTop: '3rem', color: 'white' }}>
        <h1 className="fw-bold display-4 mb-3">Find the Perfect Event Hall</h1>
        <p className="lead mb-4" style={{ maxWidth: '600px', opacity: 0.9 }}>
          Discover and book the best venues, banquet halls, and convention centers for your special day.
        </p>

        {/* SEARCH BAR CONTAINER */}
        <div className="bg-white p-3 rounded-pill shadow-lg d-flex align-items-center gap-2 flex-wrap" style={{ maxWidth: '900px', width: '90%', border: '4px solid rgba(255,255,255,0.3)' }}>

          {/* Location Dropdown */}
          <div className="d-flex align-items-center border-end px-3 flex-grow-1" style={{ minWidth: '200px' }}>
            <MapPin size={20} className="text-warning me-2" />
            <select
              className="form-select border-0 shadow-none bg-transparent fw-semibold"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              {TELANGANA_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d === "all" ? "All Locations" : d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="d-flex align-items-center flex-grow-1 px-3" style={{ minWidth: '200px' }}>
            <Search size={20} className="text-muted me-2" />
            <input
              type="text"
              className="form-control border-0 shadow-none bg-transparent"
              placeholder="Search by Hall name (e.g. 'Grand Plaza Premium')"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Search Button */}
          <button
            className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-white shadow-sm"
            onClick={handleSearch}
            style={{ minWidth: '120px' }}
          >
            Search
          </button>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-dark">
            {vendors.length > 0 ? `Found ${vendors.length} Results` : 'Explore Venders'}
          </h4>
          <div className="text-muted small">
            {loading ? 'Searching...' : 'Showing verified vendors'}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Fetching best vendors for you...</p>
          </div>
        ) : vendors.length > 0 ? (
          <div className="row g-4">
            {vendors.map((vendor, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={vendor._id || index}> {/* Use _id if mongo, or index fallback */}
                <div className="card h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                  {/* Image Area */}
                  <div className="position-relative" style={{ height: '200px' }}>
                    <img
                      src={vendor.profilePicture || hallImg} // Fallback image
                      alt={vendor.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark shadow-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1">
                        <Star size={12} className="text-warning fill-warning" />
                        {vendor.rating || '4.5'}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 m-3">
                      <span className="badge bg-warning text-dark rounded-pill px-2">
                        {vendor.vendorType || 'Vendor'}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-1 text-truncate" title={vendor.name}>{vendor.name}</h5>
                    <p className="text-muted small mb-3 d-flex align-items-center gap-1">
                      <MapPin size={14} />
                      {vendor.location || 'Location not specified'}
                    </p>

                    <p className="card-text text-muted small line-clamp-2" style={{ minHeight: '40px' }}>
                      {vendor.bio || vendor.description || "No description available for this vendor."}
                    </p>

                    <hr className="my-3 opacity-10" />

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted small display-block">Starting from</span>
                        <div className="fw-bold text-primary fs-5">
                          ₹{vendor.pricing ? vendor.pricing.toLocaleString() : 'On Request'}
                        </div>
                      </div>
                      <button
                        className="btn btn-outline-primary rounded-pill px-3"
                        onClick={() => navigate(`/venue/${vendor._id || vendor.id}`)} // Handle both id formats
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-light rounded-4">
            <img src={hallImg} alt="No Results" style={{ width: '80px', opacity: 0.3, filter: 'grayscale(100%)' }} className="mb-3" />
            <h5 className="text-muted fw-bold">No Vendors Found</h5>
            <p className="text-muted">Try adjusting your search or location to find more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
