import React, { useState, useEffect } from 'react';
import { complaintsAPI } from '../api';
import { Spinner, Alert } from './UI';
import StatusBadge, { PriorityBadge } from './StatusBadge';
import ComplaintHeatmap from './ComplaintHeatmap';

const PublicDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('recent');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await complaintsAPI.getAll();
            setComplaints(data);
        } catch (err) {
            setError('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    let sorted = [...complaints];
    if (sortBy === 'recent') {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'upvotes') {
        sorted.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === 'urgent') {
        sorted.sort((a, b) => {
            const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
            return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
        });
    }

    const topComplaints = sorted.slice(0, 6);
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
    const pendingCount = complaints.filter(c => c.status === 'Pending').length;

    if (loading) return <Spinner />;

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="card p-6 text-center hover:shadow-md transition-all">
                    <p className="text-4xl font-bold text-blue-600">{complaints.length}</p>
                    <p className="text-gray-600 text-sm font-semibold mt-2">Total Issues</p>
                </div>
                <div className="card p-6 text-center hover:shadow-md transition-all">
                    <p className="text-4xl font-bold text-green-600">{resolvedCount}</p>
                    <p className="text-gray-600 text-sm font-semibold mt-2">Resolved ✅</p>
                </div>
                <div className="card p-6 text-center hover:shadow-md transition-all">
                    <p className="text-4xl font-bold text-orange-600">{pendingCount}</p>
                    <p className="text-gray-600 text-sm font-semibold mt-2">Pending ⏳</p>
                </div>
            </div>

            {/* Heatmap */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🔥</span> Issue Density by Category
                </h2>
                <ComplaintHeatmap />
            </div>

            {/* Sort Options */}
            <div className="card p-4 flex gap-2 flex-wrap">
                <button
                    onClick={() => setSortBy('recent')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${sortBy === 'recent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    📅 Most Recent
                </button>
                <button
                    onClick={() => setSortBy('upvotes')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${sortBy === 'upvotes'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    👍 Most Supported
                </button>
                <button
                    onClick={() => setSortBy('urgent')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${sortBy === 'urgent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    🚨 Most Urgent
                </button>
            </div>

            {/* Top Complaints */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📍 Top Issues</h2>
                <div className="space-y-3">
                    {topComplaints.map((complaint, i) => (
                        <div key={complaint._id} className="card p-4 hover:shadow-md transition-all">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="font-bold text-gray-900 truncate">{complaint.title}</h3>
                                        <StatusBadge status={complaint.status} />
                                        <PriorityBadge priority={complaint.priority} />
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{complaint.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>📍 {complaint.location?.address || 'Location not specified'}</span>
                                        <span>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1">
                                            👍 <strong>{complaint.upvotes || 0}</strong> supports
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicDashboard;
