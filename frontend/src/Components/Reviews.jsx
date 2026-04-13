import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, LogIn, Pencil, Trash2, Check, X, MessageCircle, Image, XCircle, ShieldAlert } from "lucide-react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import TitleSectionText from "./ui/TitleSectionText";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/api";

const STORAGE_URL = "http://127.0.0.1:8000/storage/"

const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return STORAGE_URL + path
}

const Reviews = ({
  reviews = [],
  title = "Customer Reviews",
  showRatingSummary = true,
  laundryId = null,
  variant = "default",
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = variant === "testimonials" ? 3 : 5;
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [hasRamassage, setHasRamassage] = useState(false);
  const [checkingRamassage, setCheckingRamassage] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Fetch comments from database
  useEffect(() => {
    if (laundryId && variant === "default") {
      API.get(`/comments/laundry/${laundryId}`)
        .then((res) => {
          setLocalReviews(res.data);
        })
        .catch((err) => {
          console.error("Error fetching comments:", err);
          setLocalReviews(reviews);
        });
    } else {
      setLocalReviews(reviews);
    }
  }, [laundryId]);

  // Check if user has a ramassage for this laundry
  useEffect(() => {
    if (isAuthenticated && laundryId && variant === "default") {
      setCheckingRamassage(true);
      API.get(`/ramassages/check/${laundryId}`)
        .then((res) => {
          setHasRamassage(res.data.hasRamassage);
        })
        .catch(() => {
          setHasRamassage(false);
        })
        .finally(() => {
          setCheckingRamassage(false);
        });
    }
  }, [isAuthenticated, laundryId]);
  // Calculate average rating
  const averageRating =
    localReviews.length > 0
      ? (
          localReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          localReviews.length
        ).toFixed(1)
      : 0;

  // Get paginated reviews
  const paginatedReviews = localReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage,
  );

  const totalPages = Math.ceil(localReviews.length / reviewsPerPage);

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

  const handleImageChange = (e, type = 'comment') => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'reply') {
        setReplyImage(file);
        setReplyImagePreview(URL.createObjectURL(file));
      } else {
        setCommentImage(file);
        setCommentImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const clearImage = (type = 'comment') => {
    if (type === 'reply') {
      setReplyImage(null);
      setReplyImagePreview(null);
    } else {
      setCommentImage(null);
      setCommentImagePreview(null);
    }
  };

  const handleSubmitComments = async () => {
    if (comments.trim() === "") {
      setError({ comments: "Comment cannot be empty" });
      return;
    }
    if (selectedRating === 0) {
      setError({ comments: "Please select a rating" });
      return;
    }

    const formData = new FormData();
    formData.append('comment', comments);
    formData.append('laundryId', laundryId);
    formData.append('rating', selectedRating);
    if (commentImage) {
      formData.append('image', commentImage);
    }

    await API.post("/comment", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      const newComment = response.data.comment;
      setLocalReviews(prev => [{
        ...newComment,
        customerName: user?.name,
        name: user?.name,
        date: newComment.created_at || new Date().toISOString(),
        rating: newComment.rating || selectedRating,
        replies: newComment.replies || [],
      }, ...prev]);
      setComments("");
      setError("");
      setCommentImage(null);
      setCommentImagePreview(null);
      setSelectedRating(0);
    })
    .catch((error) => {
      console.error("Error submitting comment:", error);
      if (error.response?.status === 403) {
        setError({ comments: "You must have a reservation before leaving a review." });
      } else {
        setError({ comments: "Failed to submit comment. Please try again." });
      }
    });
  };

  const handleSubmitReply = async (parentId) => {
    if (replyText.trim() === "") return;

    const formData = new FormData();
    formData.append('comment', replyText);
    formData.append('laundryId', laundryId);
    formData.append('parent_id', parentId);
    if (replyImage) {
      formData.append('image', replyImage);
    }

    await API.post("/comment", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      console.log("Reply submitted successfully:", response.data);
      const newReply = response.data.comment;
      setLocalReviews(prev => prev.map(r => 
        r.id === parentId 
          ? { ...r, replies: [...(r.replies || []), { ...newReply, name: user?.name }] }
          : r
      ));
      setReplyingTo(null);
      setReplyText("");
      setReplyImage(null);
      setReplyImagePreview(null);
    })
    .catch((error) => {
      console.error("Error submitting reply:", error);
    });
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

    try {
      await API.put(`/comment/${reviewId}`, { comment: editText });
      setLocalReviews(prev =>
        prev.map(r => r.id === reviewId ? { ...r, comment: editText } : r)
      );
    } catch (err) {
      console.error("Failed to update comment:", err);
    }

    setEditingId(null);
    setEditText("");
  };

  // Delete a comment
  const handleDeleteComment = async (reviewId) => {
    setDeleteConfirmId(reviewId);
  };

  const confirmDelete = async () => {
    const reviewId = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await API.delete(`/comment/${reviewId}`);
      setLocalReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
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
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#1E2A36] text-center mb-2">Delete Comment</h3>
            <p className="text-sm text-[#62707D] text-center mb-6">Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[#1E2A36] font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1E2A36] tracking-tight">{title}</h2>
          <div className="w-10 h-0.5 bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] rounded-full mt-2" />
        </div>
        {showRatingSummary && localReviews.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
            <div className="flex items-center gap-1">
              {renderStars(parseFloat(averageRating))}
            </div>
            <span className="text-lg font-bold text-[#1E2A36]">
              {averageRating}
            </span>
            <span className="text-sm text-[#62707D]">({localReviews.length})</span>
          </div>
        )}
      </div>

      {localReviews.length === 0 ? (
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
                      {(review.name || review.customerName || review.user?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E2A36]">
                        {review.name || review.customerName || review.user?.name}
                      </p>
                      <p className="text-sm text-[#62707D]">
                        {formatDate(review.created_at || review.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    {isAuthenticated && (user?.name === review.name || user?.name === review.customerName || user?.id === review.user_id) && (
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
                  <>
                    <p className="text-[#62707D] leading-relaxed">
                      {review.comment}
                    </p>
                    {review.image && (
                      <div className="mt-3">
                        <img
                          src={getImageUrl(review.image)}
                          alt="Comment attachment"
                          className="max-w-xs max-h-48 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(getImageUrl(review.image), '_blank')}
                        />
                      </div>
                    )}
                  </>
                )}
                {review.service && (
                  <div className="mt-3">
                    <span className="text-sm bg-[#E0F2FE] text-[#0EA5C9] px-3 py-1 rounded-lg">
                      Service: {review.service}
                    </span>
                  </div>
                )}

                {/* Reply button */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setReplyingTo(replyingTo === review.id ? null : review.id);
                      setReplyText("");
                      setReplyImage(null);
                      setReplyImagePreview(null);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#62707D] hover:text-[#0EA5C9] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                )}

                {/* Reply form */}
                {replyingTo === review.id && (
                  <div className="mt-3 ml-6 p-4 bg-[#F7F9FA] rounded-lg border border-gray-200">
                    <p className="text-sm text-[#62707D] mb-2">
                      Replying to <span className="font-semibold text-[#1E2A36]">{review.name || review.customerName}</span>
                    </p>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full border border-gray-300 rounded-lg p-3 text-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] resize-none text-sm"
                      rows={2}
                    />
                    {replyImagePreview && (
                      <div className="relative inline-block mt-2">
                        <img src={replyImagePreview} alt="Preview" className="max-w-[120px] max-h-[80px] rounded-lg object-cover border border-gray-200" />
                        <button
                          onClick={() => clearImage('reply')}
                          className="absolute -top-2 -right-2 bg-white rounded-full shadow"
                        >
                          <XCircle className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleSubmitReply(review.id)}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-md bg-[#0EA5C9] text-white text-sm hover:bg-[#0EA5C9]/90 transition-colors"
                      >
                        Reply
                      </button>
                      <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-200 text-[#1E2A36] text-sm hover:bg-gray-300 transition-colors cursor-pointer">
                        <Image className="w-4 h-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'reply')} />
                      </label>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(""); clearImage('reply'); }}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-md bg-gray-200 text-[#1E2A36] text-sm hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4 border-l-2 border-[#E0F2FE] pl-4">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="bg-[#F7F9FA] rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5C9] to-[#1BB38C] flex items-center justify-center text-white font-semibold text-xs">
                            {(reply.name || reply.user?.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1E2A36] text-sm">{reply.name || reply.user?.name}</p>
                            <p className="text-xs text-[#62707D]">{formatDate(reply.created_at)}</p>
                          </div>
                        </div>
                        <p className="text-[#62707D] text-sm leading-relaxed">{reply.comment}</p>
                        {reply.image && (
                          <div className="mt-2">
                            <img
                              src={getImageUrl(reply.image)}
                              alt="Reply attachment"
                              className="max-w-[200px] max-h-32 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(getImageUrl(reply.image), '_blank')}
                            />
                          </div>
                        )}
                      </div>
                    ))}
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
            hasRamassage ? (
            <div>
              <p className="text-sm text-[#62707D] mb-2">Commenting as <span className="font-semibold text-[#1E2A36]">{user?.name}</span></p>
              
              {/* Star Rating Picker */}
              <div className="mb-3">
                <p className="text-sm font-medium text-[#1E2A36] mb-1">Your rating</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          i < (hoverRating || selectedRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  {selectedRating > 0 && (
                    <span className="text-sm text-[#62707D] ml-2">{selectedRating}/5</span>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <textarea
                  placeholder="add your comments here"
                  name="comments"
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 text-[#62707D] focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] resize-none mb-0"
                  rows={3}
                ></textarea>
                {error.comments && (
                  <p className="text-red-500 text-sm mt-1">{error.comments}</p>
                )}
              </div>
              {commentImagePreview && (
                <div className="relative inline-block mb-3">
                  <img src={commentImagePreview} alt="Preview" className="max-w-[150px] max-h-[100px] rounded-lg object-cover border border-gray-200" />
                  <button
                    onClick={() => clearImage('comment')}
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow"
                  >
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSubmitComments();
                  }}
                  className="py-2 px-16 rounded-md hover:bg-[#1bb38dcf] bg-[#1BB38C] text-white"
                >
                  Send
                </button>
                <label className="inline-flex items-center gap-1.5 py-2 px-4 rounded-md bg-gray-200 text-[#1E2A36] hover:bg-gray-300 transition-colors cursor-pointer">
                  <Image className="w-4 h-4" />
                  <span className="text-sm">Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'comment')} />
                </label>
              </div>
            </div>
            ) : (
              <div className="bg-amber-50 rounded-xl p-6 text-center border border-amber-200">
                <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <p className="text-[#1E2A36] font-semibold mb-1">Réservation requise</p>
                <p className="text-[#62707D] text-sm">Vous devez avoir effectué une réservation (ramassage) dans cette laverie avant de pouvoir laisser un avis.</p>
              </div>
            )
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
