import React from 'react';

const ReviewsList = ({ reviews }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="p-4 border-b border-gray-200">
            <p className="text-gray-700 mb-2">{review.reviewText}</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl ${
                    star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;
