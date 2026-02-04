import React, { useState, useRef } from "react";
import "./VendorUpload.css";
import { uploadVendorMedia } from "../api/vendorMedia.api";

const PortfolioUpload = () => {
  const [images, setImages] = useState([]);
  const inputRef = useRef();
  const vendorId = localStorage.getItem("vendorId");

  const handleFiles = async (files) => {
    if (!vendorId) {
      alert("Vendor not found. Please login again.");
      return;
    }

    const previews = [];
    const uploadedUrls = [];

    for (let file of Array.from(files)) {
      // ✅ preview
      previews.push(URL.createObjectURL(file));

      try {
        // ✅ upload to backend
        const res = await uploadVendorMedia(vendorId, file);

        if (res?.data?.imageUrl) {
          uploadedUrls.push(res.data.imageUrl);
        }
      } catch (err) {
        console.error("Portfolio upload failed", err);
      }
    }

    // ✅ show previews immediately
    setImages((prev) => [...prev, ...previews]);

    // 🔔 IMPORTANT: notify dashboard to refetch
    if (uploadedUrls.length > 0) {
      window.dispatchEvent(new Event("vendorMediaUpdated"));
    }
  };

  return (
    <div className="portfolio-section">
      <label>Shop / Portfolio Images</label>

      <div
        className="upload-box"
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <p><strong>Upload files</strong> or drag and drop</p>
        <span>PNG, JPG, GIF up to 10MB</span>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="preview-grid">
        {images.map((img, i) => (
          <div key={i} className="preview-item">
            <img src={img} alt="portfolio" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioUpload;
