import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Home.css'; // Custom styles

// Import images
import carousel1 from '../assets/hall.png';
import carousel2 from '../assets/photographer.png';
import carousel3 from '../assets/caterer.png';
import hallImg from '../assets/hall.png';
import photographerImg from '../assets/photographer.png';
import decoratorImg from '../assets/decorator.png';
import catererImg from '../assets/caterer.png';
import djImg from '../assets/dj.png';

function Home() {
  const movingServices = [
    { title: "Event Halls", img: hallImg, description: "Elegant and spacious venues suitable for weddings, receptions, corporate events, and private parties." },
    { title: "Professional Photographers", img: photographerImg, description: "Capture every memorable moment with our expert photographers and videographers." },
    { title: "Creative Decorators", img: decoratorImg, description: "Unique and themed decorations to transform your venue into a dream space." },
    { title: "Catering Services", img: catererImg, description: "Customized menus with delicious cuisine to delight your guests." },
    { title: "Top DJs", img: djImg, description: "Keep the energy alive with professional DJs and live music entertainment." },
  ];

  const eventTypes = [
    "Marriage Function",
    "Haldi Ceremony",
    "Engagement",
    "Reception",
    "Birthday Party",
    "Corporate Event",
    "Anniversary Celebration",
    "Baby Shower",
    "Farewell Party"
  ];

  return (
    <div style={{ backgroundColor: "#FDEDEC" }}> {/* Light pastel background */}
      {/* Hero Carousel Section */}
      <section className="hero-carousel">
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2500">
          <div className="carousel-inner">
            {[carousel1, carousel2, carousel3].map((img, index) => (
              <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                <img src={img} className="d-block w-100 carousel-img" alt={`Slide ${index + 1}`} />
                <div className="carousel-caption d-flex flex-column justify-content-center align-items-center">
                  <h1 className="display-3 fw-bold text-white animate__animated animate__fadeInDown">
                    Welcome to <span className="text-warning">Event All-In-One</span>
                  </h1>
                  <p className="lead mt-3 text-white animate__animated animate__fadeInUp">
                    Your one-stop solution for organizing events from start to finish 🎉
                  </p>
                  <a href="/events" className="btn btn-warning btn-lg mt-4 shadow-lg rounded-pill px-4 py-2">
                    Explore Services
                  </a>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="container my-5" style={{ backgroundColor: "#FFF5F0", padding: "40px", borderRadius: "15px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="fw-bold text-dark">Our Services</h2>
          <div className="dropdown">
            <button className="btn btn-outline-warning dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Event Types
            </button>
            <ul className="dropdown-menu p-3 shadow-lg rounded-3">
              {eventTypes.map((event, index) => (
                <li key={index}>
                  <a className="dropdown-item" href={`/events#${event.toLowerCase().replace(/ /g, '-')}`}>
                    {event} - Tailored services to make your {event.toLowerCase()} unforgettable.
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="d-flex overflow-auto gap-4 py-3 moving-services">
          {movingServices.map((service, index) => (
            <div className="card shadow-lg service-slide" key={index} style={{ minWidth: '240px', transition: 'transform 0.3s' }}>
              <img src={service.img} className="card-img-top" alt={service.title} />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">{service.title}</h5>
                <p className="text-muted">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container my-5" style={{ backgroundColor: "#FFF0F5", padding: "40px", borderRadius: "15px" }}>
        <h2 className="fw-bold mb-4 text-center text-dark">Why Choose Us & Our Promise</h2>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-4 shadow-lg rounded-3 service-box-hover" style={{ backgroundColor: "#FFFAFA" }}>
              <h4 className="fw-bold">Expert Planning</h4>
              <p className="text-muted">Our experienced team ensures every detail is perfectly executed, making your event stress-free.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-lg rounded-3 service-box-hover" style={{ backgroundColor: "#FFFAFA" }}>
              <h4 className="fw-bold">End-to-End Services</h4>
              <p className="text-muted">We handle everything — from venues to catering, decorations, entertainment, and photography.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-lg rounded-3 service-box-hover" style={{ backgroundColor: "#FFFAFA" }}>
              <h4 className="fw-bold">Memorable Experiences</h4>
              <p className="text-muted">We create unique, personalized experiences that your guests will remember forever.</p>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 text-secondary">
          We promise dedication, creativity, and attention to detail for every event. Whether it's an intimate gathering or a grand celebration, we turn your vision into reality.
        </p>
      </section>

      {/* Call to Action */}
      <section className="text-center py-5" style={{ backgroundColor: "#FFE4E1", borderRadius: "15px", margin: "20px" }}>
        <h3 className="fw-bold">Ready to plan your next event?</h3>
        <p className="lead mt-2">Contact us today and let’s make your dream event come true!</p>
        <a href="/contact" className="btn btn-light btn-lg mt-3 rounded-pill shadow-sm">Contact Us</a>
      </section>
    </div>
  );
}

export default Home;
