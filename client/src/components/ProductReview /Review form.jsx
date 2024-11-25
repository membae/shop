import React, { useState } from 'react';

const ReviewForm = ({ onAddReview }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating.');
      return;
    }

    onAddReview({ reviewText, rating });
    setReviewText('');
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
      <h3 className="text-xl font-semibold mb-3">Write a Review</h3>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience..."
        className="w-full p-2 border rounded mb-3"
        rows="4"
        required
      ></textarea>
      <div className="mb-3">
        <span className="font-medium">Rating: </span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-500' : 'text-gray-400'
            }`}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
