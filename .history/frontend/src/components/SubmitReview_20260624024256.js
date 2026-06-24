import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewAPI } from '../api';
import { Alert, Spinner } from './UI';   // UI.js is in the same folder

const SubmitReview = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      return setError('Please select a rating.');
    }
    if (!review.trim()) {
      return setError('Please write a review.');
    }

    setLoading(true);
    setError('');
    try {
      await reviewAPI.submit({ rating, review });
      setSuccess('Thank you for your review!');
      setRating(0);
      setReview('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-4">Rate CivicPulse</h3>
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
            >
              <Star
                size={28}
                className={`${
                  (hover || rating) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-slate-500">
            {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>

        {/* Review Text */}
        <textarea
          rows="4"
          placeholder="Share your experience..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={1000}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? <Spinner size="sm" color="white" /> : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;