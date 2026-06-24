import React, { useState, useEffect, useCallback } from 'react';
import { complaintsAPI } from '../api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { PageLoader, Alert, Spinner } from '../components/UI';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import IncidentMap from '../components/IncidentMap';
import generatePDF from '../utils/pdfExport';

import {
  LayoutDashboard, ListFilter, Map as MapIcon, FileDown,
  Search, ExternalLink, Calendar, MapPin, Users,
  CheckCircle2, Clock, ShieldAlert, BarChart3,
  X, User, Mail, Phone, MapPinHouse, Hash, ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState({});
  const [activeTab, setActiveTab] = useState('complaints');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Users tab state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const [comp, st] = await Promise.all([complaintsAPI.getAll(), complaintsAPI.getStats()]);
      setComplaints(comp.data || []);
      setStats(st.data || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
    } catch (err) {
      setError('System breach: Failed to synchronize data logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Fetch users when switching to Users tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');
    try {
      const { data } = await complaintsAPI.getUsers();
      setUsers(data);
    } catch (err) {
      setUsersError('Failed to load users. ' + (err.response?.data?.message || ''));
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdate = async (id, status) => {
    setUpdating(u => ({ ...u, [id]: true }));
    try {
      const { data } = await complaintsAPI.update(id, { status });
      setComplaints(cs => cs.map(c => c._id === id ? data : c));
      setSuccess(`Record updated to ${status}`);
      setTimeout(() => setSuccess(''), 3000);
      if (selectedComplaint?._id === id) {
        setSelectedComplaint(data);
      }
    } catch {
      setError('Update failed');
    } finally {
      setUpdating(u => ({ ...u, [id]: false }));
    }
  };

  const filtered = complaints.filter(c => {
    const matchFilter = filter === 'All' || c.status === filter;
    const matchSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">CP</div>
          <span className="font-black text-slate-900 tracking-tighter uppercase text-lg">CivicPulse</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'complaints', label: 'Incidents', icon: ListFilter },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
            { id: 'map', label: 'Live Map', icon: MapIcon },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden relative">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              {activeTab === 'users' ? 'Registered Users' : 'Administrative Terminal'}
            </h1>
            <p className="text-slate-500 font-medium">
              {activeTab === 'users' ? 'Citizen accounts and details.' : 'Monitoring citizen-reported infrastructure vectors.'}
            </p>
          </div>
          {activeTab !== 'users' && (
            <button
              onClick={() => generatePDF(filtered, `REPORT-${Date.now()}.pdf`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <FileDown size={16} /> Export Intelligence
            </button>
          )}
        </header>

        {/* Complaints tab */}
        {activeTab === 'complaints' && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Total Sync', val: stats.total, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Pending Lock', val: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Active Process', val: stats.inProgress, icon: ShieldAlert, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Resolved Node', val: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                  <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                    <s.icon size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Main Table */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Search UID, Name, or Location..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-1 bg-slate-50 p-1 rounded-2xl">
                  {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                        filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Incident</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map(c => (
                      <tr
                        key={c._id}
                        onClick={() => setSelectedComplaint(c)}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs">
                              {c.userId?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{c.userId?.name || 'Anonymous'}</p>
                              <p className="text-[10px] text-slate-400">{c.userId?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{c.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                            <MapPin size={10} /> {c.location?.address?.split(',')[0]}
                          </p>
                        </td>
                        <td className="px-6 py-5"><PriorityBadge priority={c.priority} /></td>
                        <td className="px-6 py-5">
                          {updating[c._id] ? <Spinner size="sm" /> : (
                            <select
                              value={c.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleUpdate(c._id, e.target.value);
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black uppercase cursor-pointer outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">Processing</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(c);
                            }}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <Users size={20} /> All Registered Users
              </h2>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : usersError ? (
              <div className="p-8">
                <Alert type="error" message={usersError} onClose={() => setUsersError('')} />
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">No registered users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Address</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">National ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                              {user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <p className="text-sm font-bold text-slate-900">{user.name || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.email || '—'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.phone || '—'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{user.address || '—'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.nationalId || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {user.role === 'admin' && <ShieldCheck size={12} />}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics tab */}
        {activeTab === 'analytics' && <AnalyticsDashboard complaints={complaints} stats={stats} />}

        {/* Map tab */}
        {activeTab === 'map' && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex justify-between items-center shadow-lg">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter">Live Spatial Grid</h2>
                <p className="text-xs font-medium text-slate-400">Mapping {filtered.length} active infrastructure nodes</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400 leading-none">{filtered.length}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Active Vectors</p>
                </div>
                <MapIcon className="text-slate-700" size={32} />
              </div>
            </div>
            <IncidentMap complaints={filtered} />
          </div>
        )}

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={() => setSelectedComplaint(null)}
          >
            <div
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedComplaint(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <StatusBadge status={selectedComplaint.status} />
                <PriorityBadge priority={selectedComplaint.priority} />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                {selectedComplaint.title}
              </h2>

              {selectedComplaint.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedComplaint.description}
                  </p>
                </div>
              )}

              {selectedComplaint.location && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin size={18} className="mt-0.5 text-blue-500" />
                    <p className="font-medium">
                      {selectedComplaint.location.address || `${selectedComplaint.location.lat}, ${selectedComplaint.location.lng}`}
                    </p>
                  </div>
                  {selectedComplaint.location.lat && selectedComplaint.location.lng && (
                    <p className="text-xs text-slate-400 mt-1">
                      Coordinates: {selectedComplaint.location.lat}, {selectedComplaint.location.lng}
                    </p>
                  )}
                </div>
              )}

              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Evidence Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedComplaint.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={img}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(img, '_blank')}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<div class="flex items-center justify-center h-full text-slate-300"><svg ...></svg></div>';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedComplaint.userId && (
                <div className="mb-6 bg-slate-50 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Submitted By</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-blue-500" />
                      <span className="font-medium text-slate-700">
                        {selectedComplaint.userId.name || 'N/A'}
                      </span>
                    </div>
                    {selectedComplaint.userId.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={16} className="text-blue-500" />
                        <span className="text-slate-600">{selectedComplaint.userId.email}</span>
                      </div>
                    )}
                    {selectedComplaint.userId.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={16} className="text-blue-500" />
                        <span className="text-slate-600">{selectedComplaint.userId.phone}</span>
                      </div>
                    )}
                    {selectedComplaint.userId.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPinHouse size={16} className="text-blue-500" />
                        <span className="text-slate-600">{selectedComplaint.userId.address}</span>
                      </div>
                    )}
                    {selectedComplaint.userId.nationalId && (
                      <div className="flex items-center gap-2 text-sm">
                        <Hash size={16} className="text-blue-500" />
                        <span className="text-slate-600">{selectedComplaint.userId.nationalId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedComplaint.createdAt && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={16} />
                  <span>
                    Submitted on{' '}
                    {new Date(selectedComplaint.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => handleUpdate(selectedComplaint._id, e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-black uppercase outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">Processing</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  onClick={() => generatePDF([selectedComplaint], `Complaint-${selectedComplaint._id}.pdf`)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <FileDown size={14} className="inline mr-1" /> Export PDF
                </button>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-500 hover:bg-slate-50 ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;