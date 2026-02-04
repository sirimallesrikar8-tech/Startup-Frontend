import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorById } from "../api/vendor.api";
import { getVendorDetails, updateVendorDetails, addVendorDetails } from "../api/vendorDetails.api";

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
    panOrTan: "",
    aadharNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasExistingDetails, setHasExistingDetails] = useState(false);

  const vendorId = localStorage.getItem("vendorId");
  const userId = localStorage.getItem("userId");

  /* 🔥 LOAD PROFILE FROM BOTH APIs */
  useEffect(() => {
    const loadProfile = async () => {
      if (!vendorId || !userId) return;
      try {
        // Load vendor basic info
        const vendorRes = await getVendorById(vendorId);
        if (vendorRes.data) {
          setForm((prev) => ({
            ...prev,
            businessName: vendorRes.data.businessName || "",
            category: vendorRes.data.category || "",
            location: vendorRes.data.location || "",
            phone: vendorRes.data.phone || "",
            email: vendorRes.data.email || "",
          }));
        }

        
        
        // Load vendor details (GST, PAN/TAN, Aadhaar)
        try {
          const detailsRes = await getVendorDetails(userId);
          if (detailsRes.data) {
            // Check if any data actually exists
            const { gstNumber, panOrTan, aadharNumber } = detailsRes.data;
            const hasData = !!(gstNumber || panOrTan || aadharNumber);

            setHasExistingDetails(hasData);

            setForm((prev) => ({
              ...prev,
              gstNumber: gstNumber || "",
              panOrTan: panOrTan || "",
              aadharNumber: aadharNumber || "",
            }));
          }
        } 
        
        
        
        
        catch (detailsErr) {
          // No existing details - that's okay, we'll create them on save
          console.log("No existing vendor details found");
          setHasExistingDetails(false);
        }
      } catch (err) {
        console.error("Failed to load vendor profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [vendorId, userId]);

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
      panOrTan: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Only validate editable fields (vendor details)
    if (!form.gstNumber?.trim()) {
      newErrors.gstNumber = "GST Number is mandatory";
    }
    if (!form.panOrTan?.trim()) {
      newErrors.panOrTan = "PAN or TAN is mandatory";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      /* 🔥 SAVE VENDOR DETAILS (GST, PAN/TAN, Aadhaar) */
      const vendorDetailsData = {
        gstNumber: form.gstNumber,
        panOrTan: form.panOrTan,
        aadharNumber: form.aadharNumber,
      };

      // Debug: log payload before sending to backend
      console.log("Saving vendor details payload:", vendorDetailsData);
      try {
        if (hasExistingDetails) {
          await updateVendorDetails(userId, vendorDetailsData);
        } else {
          await addVendorDetails(userId, vendorDetailsData);
        }
      } catch (saveErr) {
        // If update failed, try adding (in case it didn't exist)
        console.warn("Update failed, trying to create new record...", saveErr);
        await addVendorDetails(userId, vendorDetailsData);
      }

      setHasExistingDetails(true);
      localStorage.setItem("vendorProfileCompleted", "true");

      // Notify other parts of the app (dashboard) to refresh vendor details
      try {
        window.dispatchEvent(new Event("vendorDetailsUpdated"));
      } catch (evErr) {
        console.warn("Failed to dispatch vendorDetailsUpdated event", evErr);
      }

      setErrors({});
      alert("✅ Vendor Details Saved Successfully");
      navigate("/vendor/dashboard");
    } catch (err) {
      console.error("Failed to save vendor details", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

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
        {/* Business Info Section - Read Only */}
        <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '12px', color: '#666' }}>Business Information (Read Only)</h4>
          <small style={{ color: '#888', display: 'block', marginBottom: '12px' }}>
            ℹ️ Basic business info was set during registration. Contact support to update.
          </small>

          <label>Shop / Business Name</label>
          <input
            name="businessName"
            value={form.businessName || ""}
            readOnly
            disabled
            style={{ background: '#e9ecef', cursor: 'not-allowed' }}
          />

          <label>Business Category</label>
          <input
            name="category"
            value={form.category || ""}
            readOnly
            disabled
            style={{ background: '#e9ecef', cursor: 'not-allowed' }}
          />

          <label>Location</label>
          <input
            name="location"
            value={form.location || ""}
            readOnly
            disabled
            style={{ background: '#e9ecef', cursor: 'not-allowed' }}
          />

          <label>Phone Number</label>
          <input
            name="phone"
            value={form.phone || ""}
            readOnly
            disabled
            style={{ background: '#e9ecef', cursor: 'not-allowed' }}
          />

          <label>Email Address</label>
          <input
            name="email"
            value={form.email || ""}
            readOnly
            disabled
            style={{ background: '#e9ecef', cursor: 'not-allowed' }}
          />
        </div>

        {/* Editable Section - Vendor Details */}
        <h4 style={{ marginBottom: '12px', color: '#333' }}>Tax & Identity Details (Editable)</h4>

        <label>GST Number *</label>
        <input
          name="gstNumber"
          value={form.gstNumber || ""}
          onChange={handleChange}
          placeholder="Enter GST Number"
          className={errors.gstNumber ? "input-error" : ""}
        />
        {errors.gstNumber && (
          <small className="error-text">{errors.gstNumber}</small>
        )}

        <label>PAN or TAN *</label>
        <input
          name="panOrTan"
          placeholder="Enter PAN or TAN Number"
          value={form.panOrTan || ""}
          onChange={handleChange}
          className={errors.panOrTan ? "input-error" : ""}
        />
        {errors.panOrTan && (
          <small className="error-text">{errors.panOrTan}</small>
        )}

        <label>Aadhaar Number (Optional)</label>
        <input
          name="aadharNumber"
          value={form.aadharNumber || ""}
          onChange={handleChange}
          placeholder="Enter Aadhaar Number"
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

