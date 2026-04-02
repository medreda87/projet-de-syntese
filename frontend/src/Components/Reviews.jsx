import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, LogIn, Pencil, Trash2, Check, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import TitleSectionText from "./ui/TitleSectionText";
import { useAuth } from "../contexts/AuthContext";

const Reviews = ({
  reviews = [],
  title = "Customer Reviews",
  showRatingSummary = true,
  shopId = null,
  variant = "default", // "default" for shop details, "testimonials" for home page
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = variant === "testimonials" ? 3 : 5;
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // Get paginated reviews
  const paginatedReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage,
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-200"
              : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmitComments = async () => {
    // Implement the logic to submit comments here
    if (comments.trim() === "") {
      setError({ comments: "Comment cannot be empty" });
      return;
    }

    // You can use this to associate the comment with a specific shop
    // You can make an API call to submit the comment to the backend
  };

  // Start editing a comment
  const handleEditComment = (review) => {
    setEditingId(review.id);
    setEditText(review.comment);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Save edited comment
  const handleSaveEdit = async (reviewId) => {
    if (editText.trim() === "") return;

    // TODO: Make an API call to update the comment on the backend
    // e.g. await fetch(`/api/reviews/${reviewId}`, { method: 'PUT', body: JSON.stringify({ comment: editText }) })

    setEditingId(null);
    setEditText("");
  };

  // Delete a comment
  const handleDeleteComment = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    // TODO: Make an API call to delete the comment on the backend
    // e.g. await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
  };

  if (variant === "testimonials") {
    // Home page testimonials variant
    return (
      <section className="bg-[#F7F9FA] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <TitleSectionText
              titlePart1={"What Our <span>Customers</span> Say"}
              description={
                " Don't just take our word for it. See what our satisfied customers have to say about FreshFold."
              }
              descriptionClass={"text-center mx-auto"}
            />
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">★</div>
              <p className="text-[#62707D] text-lg">
                Reviews coming soon. Be the first to leave a review!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {paginatedReviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-[#62707D] mb-4 leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0EA5C9] to-[#1BB38C] flex items-center justify-center text-white font-bold text-lg">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E2A36]">
                          {review.customerName}
                        </p>
                        <p className="text-sm text-[#62707D]">
                          {review.location || "Customer"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-[#62707D]">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages - 1, prev + 1),
                      )
                    }
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  // Default variant for shop details page
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1E2A36]">{title}</h2>
        {showRatingSummary && reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(parseFloat(averageRating))}
            </div>
            <span className="text-lg font-semibold text-[#1E2A36]">
              {averageRating}
            </span>
            <span className="text-[#62707D]">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">★</div>
          <p className="text-[#62707D] text-lg">
            Reviews coming soon. Be the first to leave a review!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedReviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5C9] to-[#1BB38C] flex items-center justify-center text-white font-semibold">
                      {review.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E2A36]">
                        {review.customerName}
                      </p>
                      <p className="text-sm text-[#62707D]">
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    {isAuthenticated && user?.name === review.customerName && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => handleEditComment(review)}
                          className="p-1.5 rounded-md text-[#62707D] hover:text-[#0EA5C9] hover:bg-[#E0F2FE] transition-colors"
                          title="Edit comment"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(review.id)}
                          className="p-1.5 rounded-md text-[#62707D] hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {editingId === review.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 text-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] resize-none"
                      rows={3}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(review.id)}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-md bg-[#1BB38C] text-white text-sm hover:bg-[#1bb38dcf] transition-colors"
                      >
                        <Check className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-md bg-gray-200 text-[#1E2A36] text-sm hover:bg-gray-300 transition-colors"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#62707D] leading-relaxed">
                    {review.comment}
                  </p>
                )}
                {review.service && (
                  <div className="mt-3">
                    <span className="text-sm bg-[#E0F2FE] text-[#0EA5C9] px-3 py-1 rounded-lg">
                      Service: {review.service}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[#62707D]">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      <div>
        <div className="mt-4">
          <p className="font-bold text-xl mb-3">Add a comment</p>
          {isAuthenticated ? (
            <div>
              <p className="text-sm text-[#62707D] mb-2">Commenting as <span className="font-semibold text-[#1E2A36]">{user?.name}</span></p>
              <div className="mb-2">
                <textarea
                  placeholder="add your comments here"
                  name="comments"
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                  }}
                  className="mb-0"
                ></textarea>
                {error.comments && (
                  <p className="text-red-500 text-sm mt-1">{error.comments}</p>
                )}
              </div>
              <button
                onClick={() => {
                  handleSubmitComments();
                }}
                className="py-2 px-16 rounded-md hover:bg-[#1bb38dcf] bg-[#1BB38C] text-white"
              >
                Send
              </button>
            </div>
          ) : (
            <div className="bg-[#F7F9FA] rounded-xl p-6 text-center border border-gray-200">
              <LogIn className="w-10 h-10 text-[#0EA5C9] mx-auto mb-3" />
              <p className="text-[#1E2A36] font-semibold mb-1">Sign in to leave a review</p>
              <p className="text-[#62707D] text-sm mb-4">You need an account to share your experience with this laundry.</p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  state={{ from: location.pathname }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#0EA5C9] text-[#0EA5C9] font-medium hover:bg-[#E0F2FE] transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
