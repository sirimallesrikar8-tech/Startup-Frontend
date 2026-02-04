import React, { useState } from "react";
import "./VendorUpload.css";
import { uploadProfilePicture } from "../api/auth";

const BusinessLogoUpload = () => {
  const [logo, setLogo] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleLogo = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    // ✅ preview immediately
    setLogo(URL.createObjectURL(file));

    try {
      // ✅ upload to backend
      const res = await uploadProfilePicture(userId, file);

      const imageUrl = res?.data?.profilePicture;
      if (!imageUrl) return;

      // ✅ store latest image
      localStorage.setItem("profilePicture", imageUrl);

      // 🔔 notify dashboard AFTER backend success
      window.dispatchEvent(new Event("profilePictureUpdated"));
    } catch (err) {
      console.error("Profile picture upload failed", err);
      alert("Profile picture upload failed");
    }
  };

  return (
    <div className="logo-section">
      <div className="logo-circle">
        {logo ? <img src={logo} alt="logo" /> : <span>Logo</span>}
      </div>

      <div>
        <h6>Business Logo</h6>
        <small>JPG, PNG, SVG · Max 2MB</small>

        <div className="logo-actions">
          <label className="btn-outline">
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogo}
            />
          </label>

          {logo && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => setLogo(null)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessLogoUpload;
