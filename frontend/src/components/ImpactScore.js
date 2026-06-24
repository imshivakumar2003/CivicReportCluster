import React, { useState, useEffect } from 'react';
import { complaintsAPI } from '../api';
import { Spinner, Alert } from './UI';

const ImpactScore = ({ complaint }) => {
    // Calculate impact score based on: upvotes, priority, days without resolution
    const daysPassed = Math.floor((new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24));
    const priorityScore = { 'High': 10, 'Medium': 5, 'Low': 2 }[complaint.priority] || 5;
    const statusScore = complaint.status === 'Resolved' ? 0 : complaint.status === 'In Progress' ? 5 : 10;
    const upvoteScore = (complaint.upvotes || 0) * 2;

    const score = priorityScore + statusScore + upvoteScore + Math.min(daysPassed, 20);
    const color = score > 25 ? 'text-red-600' : score > 15 ? 'text-orange-600' : 'text-green-600';

    return (
        <div className={`text-center ${color}`}>
            <p className="text-2xl font-bold">{Math.min(100, score)}</p>
            <p className="text-xs font-semibold">Impact Score</p>
        </div>
    );
};

const UpvoteButton = ({ complaint, onUpvote }) => {
    const [upvoting, setUpvoting] = useState(false);
    const upvotes = complaint.upvotes || 0;
    const userUpvoted = complaint.userUpvoted || false;

    const handleUpvote = async () => {
        setUpvoting(true);
        try {
            await onUpvote(complaint._id);
        } finally {
            setUpvoting(false);
        }
    };

    return (
        <button
            onClick={handleUpvote}
            disabled={upvoting}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${userUpvoted
                    ? 'bg-blue-100 text-blue-600 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
        >
            <span className="text-lg">{upvoting ? <Spinner size="sm" /> : '👍'}</span>
            <span className="text-xs font-bold">{upvotes}</span>
        </button>
    );
};

export { ImpactScore, UpvoteButton };
