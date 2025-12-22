import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./Contact.css";

import bgImg from "../assets/bg2.png";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessageText] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  // API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    try {
      const response = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      // No "result" variable → no unused-vars error
      await response.text();

      if (response.ok) {
        setResponseMsg("✅ Message sent successfully!");
        setName("");
        setEmail("");
        setMessageText("");
      } else {
        setResponseMsg("❌ Failed to send message. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMsg("⚠️ Server error. Try again later.");
    }
  };

  return (
    <div
      className="contact-page d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImg}) center/cover no-repeat`,
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div
              className="card shadow-lg p-5 rounded-4 animate__animated animate__fadeInUp"
              style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
            >
              <h2 className="fw-bold mb-4 text-center">Contact Us</h2>

              {responseMsg && (
                <div className="alert alert-info text-center">{responseMsg}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="form-control form-control-lg rounded-pill"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="form-control form-control-lg rounded-pill"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <textarea
                    placeholder="Your Message"
                    className="form-control form-control-lg rounded-3"
                    rows="6"
                    value={message}
                    onChange={(e) => setMessageText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning btn-lg w-100 rounded-pill shadow-sm"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
