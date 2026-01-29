import React, { useEffect, useState } from "react";
import "./VendorReviews.css";
import { getVendorReviews } from "../api/vendor.api";
import { getVendorById } from "../api/vendor.api";

const VendorReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const vendorId = localStorage.getItem("vendorId");

    useEffect(() => {
        const fetchReviews = async () => {
            if (!vendorId) return;
            try {
                const res = await getVendorReviews(vendorId);
                // The API returns reviews in res.data, ensure it's an array
                const reviewData = Array.isArray(res.data) ? res.data : [];
                setReviews(reviewData);

                // Fetch vendor rating if available
                const vendorData = await getVendorById(vendorId);
                if (vendorData.data) {
                    setRating(vendorData.data.rating || 0);
                }

            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [vendorId]);

    const renderStars = (score) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={i < score ? "star filled" : "star"}>★</span>
        ));
    };

    return (
        <div className="vendor-reviews-page">
            <h2>User Reviews & Feedback</h2>

            <div className="review-summary">
                <div className="rating-card">
                    <h3>{rating.toFixed(1)}</h3>
                    <div className="stars">{renderStars(Math.round(rating))}</div>
                    <p>Overall Rating</p>
                </div>
                <div className="total-reviews">
                    <h3>{reviews.length}</h3>
                    <p>Total Reviews</p>
                </div>
            </div>

            <div className="reviews-list">
                {loading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <div className="no-reviews">
                        <p>No reviews received yet.</p>
                    </div>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="review-header">
                                <span className="reviewer-name">{review.userName || "Anonymous User"}</span>
                                <span className="review-date">
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '—'}
                                </span>
                            </div>
                            <div className="review-rating">{renderStars(review.rating || 0)}</div>
                            <p className="review-comment">{review.comment || review.feedback}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VendorReviews;
