import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Events.css";

import hallImg from "../assets/hall.png";
import photographerImg from "../assets/photographer.png";
import decoratorImg from "../assets/decorator.png";
import catererImg from "../assets/caterer.png";
import djImg from "../assets/dj.png";
import hotelImg from "../assets/hotel.png";

/* TELANGANA DISTRICTS */
const TELANGANA_DISTRICTS = [
  "all", "adilabad", "bhadradri kothagudem", "hanumakonda", "hyderabad",
  "jagtial", "jangaon", "jayashankar bhupalpally", "jogulamba gadwal",
  "kamareddy", "karimnagar", "khammam", "komaram bheem asifabad",
  "mahabubabad", "mahabubnagar", "mancherial", "medak", "medchal–malkajgiri",
  "mulugu", "nagarkurnool", "nalgonda", "narayanpet", "nirmal", "nizamabad",
  "peddapalli", "rajanna sircilla", "rangareddy", "sangareddy", "siddipet",
  "suryapet", "vikarabad", "wanaparthy", "warangal"
];

/* SERVICES DATA (IDs MATCH BookingService) */
const ALL_SERVICES = [
  { id: "grand-plaza-hall", title: "Halls", type: "hall", location: "hyderabad", img: hallImg, price: 25000, unavailableDates: ["2025-01-20", "2025-01-25"] },
  { id: "elegance-photography", title: "Photographers", type: "photo", location: "karimnagar", img: photographerImg, price: 15000, unavailableDates: ["2025-01-18"] },
  { id: "decorators", title: "Decorators", type: "decor", location: "warangal", img: decoratorImg, price: 10000, unavailableDates: [] },
  { id: "caterers", title: "Caterers", type: "food", location: "hyderabad", img: catererImg, price: 500, unavailableDates: ["2025-01-19"] },
  { id: "djs", title: "DJs", type: "dj", location: "nalgonda", img: djImg, price: 8000, unavailableDates: ["2025-01-21"] },
  { id: "hotels", title: "Hotels", type: "hotel", location: "hyderabad", img: hotelImg, price: 3500, unavailableDates: [] }
];

const formatDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

function Events() {
  const navigate = useNavigate();

  const [priceRange, setPriceRange] = useState(50000);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("all");

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setPriceRange(50000);
    setSelectedTypes([]);
    setSelectedDate(new Date());
    setSearchText("");
    setLocation("all");
  };

  const filteredServices = ALL_SERVICES
    .filter(s => s.price <= priceRange)
    .filter(s => selectedTypes.length === 0 || selectedTypes.includes(s.type))
    .filter(s => !s.unavailableDates.includes(formatDate(selectedDate)))
    .filter(s => searchText === "" || s.title.toLowerCase().includes(searchText.toLowerCase()))
    .filter(s => location === "all" || s.location === location);

  return (
    <div className="container-fluid my-5">

      {/* HERO */}
      <div className="market-hero mb-4">
        <h2 className="fw-bold">
          Find the perfect service for your <span>event</span>
        </h2>
        <p>Browse verified venues, caterers & decorators ready for your big day</p>
      </div>

      <div className="row">

        {/* FILTER SIDEBAR */}
        <div className="col-md-3">
          <div className="filters-box">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold">Filters</h5>
              <button className="btn btn-link text-warning p-0" onClick={resetFilters}>
                Reset All
              </button>
            </div>

            <h6 className="mt-3">Service Type</h6>
            {[
              { label: "Venues & Halls", value: "hall" },
              { label: "Hotels", value: "hotel" },
              { label: "Decorators", value: "decor" },
              { label: "Photographers", value: "photo" },
              { label: "Catering", value: "food" },
              { label: "DJs", value: "dj" }
            ].map(t => (
              <div className="form-check" key={t.value}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedTypes.includes(t.value)}
                  onChange={() => toggleType(t.value)}
                />
                <label className="form-check-label">{t.label}</label>
              </div>
            ))}

            <h6 className="mt-4">Price Range</h6>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="form-range"
            />
            <small>Up to ₹{priceRange.toLocaleString()}</small>

            <h6 className="mt-4">Select Date</h6>
            <Calendar value={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>

        {/* SERVICES */}
        <div className="col-md-9">

          {/* 🔍 SEARCH + LOCATION BAR */}
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <input
                type="text"
                className="form-control rounded-pill px-4"
                style={{ maxWidth: "280px" }}
                placeholder="Search services..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <select
                className="form-select rounded-pill px-4"
                style={{ maxWidth: "220px" }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {TELANGANA_DISTRICTS.map(d => (
                  <option key={d} value={d}>
                    {d === "all" ? "All Locations" : d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-muted mb-2">
            Showing {filteredServices.length} results
          </p>

          <div className="row g-4">
            {filteredServices.map(s => (
              <div className="col-md-4" key={s.id}>
                <div className="market-card">
                  {/* Clickable image - goes to venue details */}
                  <div
                    className="market-img"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/venue/${s.id}`)}
                  >
                    <img src={s.img} alt={s.title} />
                    <span className="verified-badge">✔ Verified</span>
                    <span
                      className={`heart ${favorites.includes(s.id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(s.id);
                      }}
                    >
                      ♥
                    </span>
                  </div>

                  <div className="p-3">
                    <h6
                      className="fw-bold"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/venue/${s.id}`)}
                    >
                      {s.title}
                    </h6>
                    <p className="price">₹{s.price.toLocaleString()} <span>/ event</span></p>

                    {/* Book Now - handles login redirect */}
                    <button
                      className="btn btn-warning w-100 rounded-pill mb-2"
                      onClick={() => {
                        if (!!localStorage.getItem("token")) {
                          navigate(`/book/${s.id}`);
                        } else {
                          localStorage.setItem("redirectAfterLogin", `/book/${s.id}`);
                          navigate("/login");
                        }
                      }}
                    >
                      Book Now
                    </button>

                    {/* View Details button */}
                    <button
                      className="btn btn-outline-secondary w-100 rounded-pill"
                      onClick={() => navigate(`/venue/${s.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Events;
