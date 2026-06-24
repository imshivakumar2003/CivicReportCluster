import React, { useState } from 'react';
import { complaintsAPI } from '../api';
import { Spinner, Alert } from './UI';

const RatingCard = ({ complaint, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    if (complaint.rating) {
        return (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">Your Feedback</h4>
                    <span className="text-2xl">⭐</span>
                </div>
                <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < complaint.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>★</span>
                    ))}
                </div>
                <p className="text-sm text-gray-600">{complaint.feedback}</p>
            </div>
        );
    }

    const handleSubmit = async () => {
        if (!rating) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await complaintsAPI.addRating(complaint._id, { rating, feedback });
            onSuccess?.();
        } catch (err) {
            setError('Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-3">Rate This Response</h4>
            {error && <Alert type="error" message={error} />}

            <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl transition-transform hover:scale-110"
                    >
                        <span className={hoverRating >= star || rating >= star ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    </button>
                ))}
            </div>

            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your feedback (optional)"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 mb-3"
                rows="3"
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <><Spinner /> Submitting...</> : 'Submit Feedback'}
            </button>
        </div>
    );
};

export default RatingCard;
