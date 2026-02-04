import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./VendorUpload.css";
import { deleteVendorMedia } from "../api/vendorMedia.api";

const VendorMediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    if (!vendorId) return;

    const fetchMedia = async () => {
      try {
        const res = await api.get(`/api/vendor-media/vendor/${vendorId}`);
        setMedia(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load media", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [vendorId]);

  const handleDelete = async (mediaId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) return;

    try {
      await deleteVendorMedia(mediaId);

      // ✅ remove image from UI instantly
      setMedia((prev) => prev.filter((item) => item.id !== mediaId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete image");
    }
  };

  if (loading) return <p>Loading images...</p>;

  if (media.length === 0) return <p>No images uploaded yet</p>;

  return (
    <div className="image-grid">
      {media.map((item) => (
        <div key={item.id} className="image-thumb">
          <img
            src={item.imageUrl}
            alt="vendor media"
          />

          {/* ✅ DELETE BUTTON */}
          <button
            className="delete-btn"
            onClick={() => handleDelete(item.id)}
          >
            ❌ Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default VendorMediaGallery;
