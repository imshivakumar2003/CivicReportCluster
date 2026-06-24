import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintsAPI } from '../api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { PageLoader, Alert } from '../components/UI';
import RatingCard from '../components/RatingCard';
import {
  MapPin, Droplets, Zap, Trash2, Siren, TreeDeciduous,
  ClipboardList, Plus, BarChart3, Clock, Loader2, CheckCircle2, Inbox
} from 'lucide-react';

const categoryIcons = {
  Roads: <MapPin size={20} />,
  'Water Supply': <Droplets size={20} />,
  Electricity: <Zap size={20} />,
  Sanitation: <Trash2 size={20} />,
  'Public Safety': <Siren size={20} />,
  Parks: <TreeDeciduous size={20} />,
  Other: <ClipboardList size={20} />
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

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

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  const stats = [
    { label: 'Total', value: complaints.length, icon: <BarChart3 size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length, icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, icon: <Loader2 size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, icon: <CheckCircle2 size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Reports</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link
            to="/new-complaint"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={18} />
            New Report
          </Link>
        </div>

        {error && <div className="mb-6"><Alert type="error" message={error} /></div>}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === f
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No reports found</h3>
            <p className="text-gray-500 mt-1 mb-6">You haven't filed any reports in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Category Icon */}
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 border border-gray-100">
                  {categoryIcons[c.category] || categoryIcons.Other}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{c.title}</h3>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-1">{c.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {c.location?.address || 'Location hidden'}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;