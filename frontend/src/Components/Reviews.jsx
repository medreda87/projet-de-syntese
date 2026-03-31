import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import TitleSectionText from './ui/TitleSectionText';

const Reviews = ({ 
  reviews = [], 
  title = "Customer Reviews",
  showRatingSummary = true,
  shopId = null,
  variant = "default" // "default" for shop details, "testimonials" for home page
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = variant === "testimonials" ? 3 : 5;

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Get paginated reviews
  const paginatedReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-200'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (variant === "testimonials") {
    // Home page testimonials variant
    return (
      <section className="bg-[#F7F9FA] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">

            <TitleSectionText
              titlePart1={"What Our <span>Customers</span> Say"}
              description={" Don't just take our word for it. See what our satisfied customers have to say about FreshFold."}
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
                        <p className="font-semibold text-[#1E2A36]">{review.customerName}</p>
                        <p className="text-sm text-[#62707D]">{review.location || 'Customer'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-[#62707D]">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
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
            <span className="text-lg font-semibold text-[#1E2A36]">{averageRating}</span>
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
                      <p className="font-semibold text-[#1E2A36]">{review.customerName}</p>
                      <p className="text-sm text-[#62707D]">
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-[#62707D] leading-relaxed">{review.comment}</p>
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
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[#62707D]">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;
