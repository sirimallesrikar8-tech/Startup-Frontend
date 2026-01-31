import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BusinessLogoUpload from "./BusinessLogoUpload";
import PortfolioUpload from "./PortfolioUpload";
import VendorMediaGallery from "./VendorMediaGallery";

const VendorProfileForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: "",
    category: "",
    location: "",
    phone: "",
    email: "",
    gstNumber: "",
    panNumber: "",
    tanNumber: "",
    aadhaarNumber: "",
  });

  const [errors, setErrors] = useState({});

  /* 🔥 LOAD SAVED PROFILE (EDIT MODE / FIRST LOGIN CHECK) */
  useEffect(() => {
    const savedProfile = localStorage.getItem("vendorProfileData");
    if (savedProfile) {
      setForm(JSON.parse(savedProfile));
    }
  }, []);

  /* ✅ Clear error for field when user types */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      panTan: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.businessName.trim()) {
      newErrors.businessName = "Business Name is required";
    }
    if (!form.category) {
      newErrors.category = "Business Category is required";
    }
    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email Address is required";
    }
    if (!form.gstNumber.trim()) {
      newErrors.gstNumber = "GST Number is mandatory";
    }
    if (!form.panNumber.trim() && !form.tanNumber.trim()) {
      newErrors.panTan = "PAN or TAN is mandatory";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    /* 🔥 SAVE PROFILE LOCALLY (NO BACKEND) */
    localStorage.setItem(
      "vendorProfileData",
      JSON.stringify(form)
    );

    localStorage.setItem("vendorProfileCompleted", "true");

    setErrors({});
    alert("✅ Vendor Profile Saved Successfully");
    navigate("/vendor/dashboard");
  };

  return (
    <div className="vendor-card">
      <h2>Edit Vendor Profile</h2>
      <p className="subtitle">
        Manage your business details, contact info, and public appearance.
      </p>

      {/* 🔥 PROFILE PICTURE UPLOAD */}
      <BusinessLogoUpload
        onUploadSuccess={(profilePicturePath) => {
          localStorage.setItem("profilePicture", profilePicturePath);
          window.dispatchEvent(new Event("profilePictureUpdated"));
        }}
      />

      <form onSubmit={handleSubmit} noValidate>
        <label>Shop / Business Name *</label>
        <input
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
          className={errors.businessName ? "input-error" : ""}
        />
        {errors.businessName && (
          <small className="error-text">{errors.businessName}</small>
        )}

        <label>Business Category *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={errors.category ? "input-error" : ""}
        >
          <option value="">Select category</option>
          <option>Venue / Hall</option>
          <option>Hotel</option>
          <option>Decorator</option>
          <option>Photographer</option>
          <option>Caterer</option>
          <option>DJ</option>
        </select>
        {errors.category && (
          <small className="error-text">{errors.category}</small>
        )}

        <label>Location *</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className={errors.location ? "input-error" : ""}
        />
        {errors.location && (
          <small className="error-text">{errors.location}</small>
        )}

        <label>Phone Number *</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={errors.phone ? "input-error" : ""}
        />
        {errors.phone && (
          <small className="error-text">{errors.phone}</small>
        )}

        <label>Email Address *</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && (
          <small className="error-text">{errors.email}</small>
        )}

        <label>GST Number *</label>
        <input
          name="gstNumber"
          value={form.gstNumber}
          onChange={handleChange}
          className={errors.gstNumber ? "input-error" : ""}
        />
        {errors.gstNumber && (
          <small className="error-text">{errors.gstNumber}</small>
        )}

        <label>PAN or TAN *</label>
        <input
          name="panNumber"
          value={form.panNumber}
          onChange={handleChange}
        />
        <input
          name="tanNumber"
          value={form.tanNumber}
          onChange={handleChange}
        />
        {errors.panTan && (
          <small className="error-text">{errors.panTan}</small>
        )}

        <label>Aadhaar Number (Optional)</label>
        <input
          name="aadhaarNumber"
          value={form.aadhaarNumber}
          onChange={handleChange}
        />

        <PortfolioUpload />

        <h3 style={{ marginTop: 24 }}>Uploaded Portfolio</h3>
        <VendorMediaGallery />

        <div className="btn-row">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorProfileForm;
