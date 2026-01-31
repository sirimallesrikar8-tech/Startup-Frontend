import React, { useRef } from "react";
import api from "../api/axios"; // ✅ your axios instance
import "./VendorProfileForm.css";

const ImageUploadBox = ({ images, setImages, multiple = true }) => {
  const inputRef = useRef();
  const vendorId = localStorage.getItem("vendorId");

  const uploadFiles = async (files) => {
    if (!vendorId) {
      alert("Vendor not found. Please login again.");
      return;
    }

    const uploadedImages = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file); // ✅ ONLY file

      try {
        const res = await api.post(
          `/api/vendor-media/upload?vendorId=${vendorId}`, // ✅ vendorId as query
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // ✅ Swagger returns imageUrl
        if (res?.data?.imageUrl) {
          uploadedImages.push(res.data.imageUrl);
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Image upload failed");
      }
    }

    // save uploaded image URLs
    setImages((prev) => [...prev, ...uploadedImages]);
    window.dispatchEvent(new Event("vendorMediaUpdated"));

  };
  
  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    uploadFiles(files);
  };

  return (
    <>
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
        <small>PNG, JPG, GIF up to 10MB</small>

        <input
          type="file"
          ref={inputRef}
          hidden
          multiple={multiple}
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* PREVIEW GRID */}
      <div className="image-grid">
        {images.map((img, index) => (
          <div key={index} className="image-thumb">
            <img src={img} alt="uploaded" />
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageUploadBox;
