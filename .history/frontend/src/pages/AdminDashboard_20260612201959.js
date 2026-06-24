import React, { useState, useEffect, useCallback } from 'react';
import { complaintsAPI } from '../api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { PageLoader, Alert, Spinner } from '../components/UI';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import IncidentMap from '../components/IncidentMap';
import generatePDF from '../utils/pdfExport';

import {
  LayoutDashboard, ListFilter, Map as MapIcon, FileDown,
  Search, ExternalLink, Trash2, Calendar, MapPin,
  CheckCircle2, Clock, ShieldAlert, BarChart3
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

  const handleUpdate = async (id, status) => {
    setUpdating(u => ({ ...u, [id]: true }));
    try {
      const { data } = await complaintsAPI.update(id, { status });
      setComplaints(cs => cs.map(c => c._id === id ? data : c));
      setSuccess(`Record updated to ${status}`);
      setTimeout(() => setSuccess(''), 3000);
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
            { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
            { id: 'map', label: 'Live Map', icon: MapIcon },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
              <item.icon size={18} strokeWidth={2.5} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Administrative Terminal</h1>
            <p className="text-slate-500 font-medium">Monitoring citizen-reported infrastructure vectors.</p>
          </div>
          <button
            onClick={() => generatePDF(filtered, `REPORT-${Date.now()}.pdf`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <FileDown size={16} /> Export Intelligence
          </button>
        </header>

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

            {/* Main Table Container */}
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
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
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
                      <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
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
                              onChange={(e) => handleUpdate(c._id, e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black uppercase cursor-pointer outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">Processing</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
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

        {activeTab === 'analytics' && <AnalyticsDashboard complaints={complaints} stats={stats} />}

        {activeTab === 'map' && (
          <div className="flex flex-col gap-4">
            {/* Header for Map to match Dashboard style */}
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
            {/* The Actual Map - Passing 'filtered' so it updates with your search/filters */}
            <IncidentMap complaints={filtered} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;