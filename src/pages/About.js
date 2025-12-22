import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./About.css";

// Images
import hallImg from "../assets/hall.png";
import photographerImg from "../assets/photographer.png";
import catererImg from "../assets/caterer.png";
import heroBg from "../assets/bg.png";
import founderImg from "../assets/founder.jpg";
// import ctoImg from "../assets/cto.png"; // ❌ CTO image commented

function About() {
  const servicesPreview = [
    { title: "Event Halls", img: hallImg },
    { title: "Professional Photographers", img: photographerImg },
    { title: "Catering Services", img: catererImg },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="text-center text-white d-flex align-items-center justify-content-center hero-about"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div>
          <h1 className="display-4 fw-bold animate__animated animate__fadeInDown">
            About <span className="text-warning">Event All-In-One</span>
          </h1>
          <p className="lead mt-3 animate__animated animate__fadeInUp">
            Making event management simple, elegant, and effortless.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src={hallImg}
              alt="About"
              className="img-fluid rounded shadow-lg animate__animated animate__zoomIn"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold text-dark mb-3">Who We Are</h2>
            <p className="text-muted">
              Event All-In-One is your one-stop platform to manage everything
              related to events — from booking venues to arranging DJs,
              photographers, and caterers.
            </p>
            <p className="text-muted">
              Our mission is to make your event planning experience smooth and
              stress-free, so you can focus on creating unforgettable memories.
            </p>
            <button className="btn btn-dark rounded-pill px-4 mt-3 shadow-sm">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ⭐ Founder Section */}
      <section className="container my-5">
        <h2 className="fw-bold text-center text-dark mb-5">
          Meet Our Leadership
        </h2>

        <div className="row text-center justify-content-center">
          {/* Founder */}
          <div className="col-md-5 mb-4">
            <img
              src={founderImg}
              alt="Founder"
              className="rounded-circle shadow-lg"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
            <h3 className="fw-bold mt-3">D. CHAMPLA</h3>
            <p className="text-muted">Founder</p>
            <p
              className="text-muted"
              style={{ maxWidth: "350px", margin: "auto" }}
            >
              Visionary behind Event All-In-One, leading innovation,
              planning, and customer success.
            </p>
          </div>

          {/*
          =========================
          CTO SECTION COMMENTED
          =========================

          <div className="col-md-5 mb-4">
            <img
              src={ctoImg}
              alt="CTO"
              className="rounded-circle shadow-lg"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
            <h3 className="fw-bold mt-3">Srikar Sirimalle</h3>
            <p className="text-muted">Chief Technology Officer (CTO)</p>
            <p
              className="text-muted"
              style={{ maxWidth: "350px", margin: "auto" }}
            >
              Architecting the entire platform including frontend, backend,
              databases, APIs, performance, and advanced technology solutions.
            </p>
          </div>
          */}
        </div>
      </section>

      {/* Mission Section */}
      <section
        className="text-center py-5 mission-section"
        style={{ backgroundColor: "#f8f9fa", color: "#212529" }}
      >
        <div className="container">
          <h2 className="fw-bold mb-4 text-dark">Our Mission</h2>
          <p className="lead text-muted mb-2">
            To revolutionize event management by bringing every service together
            under one smart, user-friendly platform.
          </p>
          <p className="lead text-muted mb-2">
            We aim to provide seamless booking experiences for all event services.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section container text-center my-5">
        <h2 className="fw-bold text-dark mb-4">Our Vision</h2>
        <p className="text-muted mb-2">
          To become the most trusted and innovative event management platform globally.
        </p>
      </section>

      {/* Preview Services */}
      <section className="container my-5">
        <h2 className="fw-bold text-center mb-4 text-dark">Our Key Services</h2>
        <div className="d-flex overflow-auto gap-4 py-3 moving-services">
          {servicesPreview.map((service, index) => (
            <div
              className="card shadow-lg service-slide"
              key={index}
              style={{ minWidth: "220px", transition: "transform 0.3s" }}
            >
              <img
                src={service.img}
                className="card-img-top"
                alt={service.title}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">{service.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-5 text-white cta-about">
        <h3 className="fw-bold">Ready to plan your next event?</h3>
        <p className="lead mt-2">
          Contact us today and let’s make your dream event come true!
        </p>
        <a
          href="/contact"
          className="btn btn-light btn-lg mt-3 rounded-pill shadow-sm"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

export default About;
