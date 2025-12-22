import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./Events.css";

// Images
import hallImg from "../assets/hall.png";
import photographerImg from "../assets/photographer.png";
import decoratorImg from "../assets/decorator.png";
import catererImg from "../assets/caterer.png";
import djImg from "../assets/dj.png";
import heroBg from "../assets/bg2.png";

function Events() {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [organizerPhone, setOrganizerPhone] = useState("");
  const [organizerBio, setOrganizerBio] = useState("");

  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const services = [
    { title: "Halls", img: hallImg },
    { title: "Photographers", img: photographerImg },
    { title: "Decorators", img: decoratorImg },
    { title: "Caterers", img: catererImg },
    { title: "DJs", img: djImg }
  ];

  const today = new Date().toISOString().slice(0, 16);

  // Reset input form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setCategoryName("");
    setOrganizerName("");
    setOrganizerEmail("");
    setOrganizerPhone("");
    setOrganizerBio("");
  };

  // Search API
  const fetchSearchResults = async (query) => {
    if (!query) return setSearchResults([]);

    try {
      const res = await fetch(`http://localhost:8080/api/events/search?q=${query}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery]);

  // Email API (your exact endpoint)
  const sendEmail = async (to, subject, message) => {
    try {
      const res = await fetch("http://localhost:8080/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setMessage("📧 Email sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to send email.");
    }
  };

  // Handle event creation + trigger email
  const handleEventSubmit = async (e) => {
    e.preventDefault();

    const body = {
      title,
      description,
      location,
      startDate,
      endDate,
      category: { name: categoryName },
      organizer: {
        name: organizerName,
        email: organizerEmail,
        phone: organizerPhone,
        bio: organizerBio
      }
    };

    try {
      const response = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setMessage("🎉 Event Created Successfully!");
        resetForm();
        setShowForm(false);
        fetchSearchResults(searchQuery);

        // Send confirmation email
        await sendEmail(
          organizerEmail,
          `Event Created: ${title}`,
          `Hello ${organizerName}, your event "${title}" has been successfully created.`
        );
      } else {
        setMessage("❌ " + (await response.text()));
      }
    } catch (err) {
      setMessage("⚠️ Server Error");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="text-center text-white d-flex align-items-center justify-content-center hero-events"
        style={{
          backgroundImage: `url(${heroBg})`,
          height: "50vh",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div>
          <h1 className="display-4 fw-bold animate__animated animate__fadeInDown">
            <span className="text-warning">Events</span>
          </h1>
          <p className="lead mt-3 animate__animated animate__fadeInUp">
            Create and manage your events easily
          </p>
        </div>
      </section>

      {message && <div className="alert alert-info text-center mt-3">{message}</div>}

      {/* Search Bar */}
      <div className="container mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="container my-4">
          <h4 className="mb-3">Search Results</h4>
          <div className="row g-4">
            {searchResults.map((event) => (
              <div className="col-md-4" key={event.id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">{event.description}</p>
                    <p className="text-muted">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="container my-5">
        <div className="row g-4">
          {services.map((s, i) => (
            <div className="col-md-4" key={i}>
              <div className="card shadow-lg border-0 h-100 service-card">
                <img
                  src={s.img}
                  className="card-img-top"
                  style={{ height: "230px", objectFit: "cover" }}
                  alt={s.title}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{s.title}</h5>
                  <button
                    className="btn btn-gradient rounded-pill px-4 mt-2 shadow-sm"
                    onClick={() => {
                      setEventName(s.title);
                      setTitle(s.title);
                      setShowForm(true);
                    }}
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Form */}
      {showForm && (
        <div className="booking-popup">
          <div className="booking-form animate__animated animate__zoomIn">
            <h3 className="fw-bold mb-3 text-center">Create {eventName} Event</h3>

            <form onSubmit={handleEventSubmit}>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Category Name"
                    required
                  />
                </div>
              </div>

              <textarea
                className="form-control mb-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                rows="3"
              />

              <input
                className="form-control mb-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                required
              />

              <div className="row">
                <div className="col-md-6 mb-2">
                  <label>Start Date</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label>End Date</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={endDate}
                    min={today}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Organizer */}
              <h5 className="mt-3">Organizer Details</h5>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    placeholder="Phone"
                    required
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    value={organizerBio}
                    onChange={(e) => setOrganizerBio(e.target.value)}
                    placeholder="Bio"
                    required
                  />
                </div>
              </div>

              <button className="btn btn-warning w-100 mt-3 rounded-pill">
                Create Event & Send Email
              </button>

              <button
                type="button"
                className="btn btn-secondary w-100 mt-2 rounded-pill"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
