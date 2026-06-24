import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../api';
import { Spinner, Alert } from '../components/UI';
import ImageUpload from '../components/ImageUpload';
import {
  ChevronLeft, MapPin, Send, Info,
  Construction, Droplets, Zap, Trash2,
  ShieldAlert, Trees, PlusCircle, AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Roads', icon: <Construction size={20} />, label: 'Roads' },
  { id: 'Water Supply', icon: <Droplets size={20} />, label: 'Water' },
  { id: 'Electricity', icon: <Zap size={20} />, label: 'Electricity' },
  { id: 'Sanitation', icon: <Trash2 size={20} />, label: 'Sanitation' },
  { id: 'Public Safety', icon: <ShieldAlert size={20} />, label: 'Safety' },
  { id: 'Parks', icon: <Trees size={20} />, label: 'Parks' },
  { id: 'Other', icon: <PlusCircle size={20} />, label: 'Other' },
];

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Other', priority: 'Medium',
    location: { address: '', lat: null, lng: null }, images: []
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return setError('Title and description are required');
    setLoading(true);
    setError('');
    try {
      await complaintsAPI.create(form);
      setSuccess('Report transmitted successfully.');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Protocol failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) return setError('Geolocation protocol not supported');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          address = data.display_name?.split(',').slice(0, 3).join(',') || address;
        } catch { }
        setForm(f => ({ ...f, location: { address, lat, lng } }));
        setLocating(false);
      },
      () => { setError('GPS Lock Failed. Manual entry required.'); setLocating(false); }
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all mb-8 font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Report Incident</h1>
            <p className="text-slate-500 mt-2 font-medium">Initialize a new civic infrastructure report.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
            <Info size={12} /> Priority: {form.priority}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* 1. Category Selection */}
            <section>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">01. Classification</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.id })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${form.category === cat.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600'
                      }`}
                  >
                    <div className="mb-2">{cat.icon}</div>
                    <span className="text-[11px] font-black uppercase tracking-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Details Section */}
            <section className="space-y-6">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">02. Incident Intelligence</h2>

              <div className="relative group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute -top-2 left-4 bg-[#fcfcfd] px-2 z-10 group-focus-within:text-blue-600 transition-colors">Incident Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Major Water Leakage on 5th Avenue"
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute -top-2 left-4 bg-[#fcfcfd] px-2 z-10 group-focus-within:text-blue-600 transition-colors">Detailed Briefing</label>
                <textarea
                  placeholder="Describe the technical specifics, landmarks, and duration..."
                  className="w-full px-5 py-5 bg-white border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all min-h-[140px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
            </section>

            {/* 3. Location & Priority */}
            <section className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">03. Geolocation</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Physical address..."
                    className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none"
                    value={form.location.address}
                    onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
                  />
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={locating}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {locating ? <Spinner size="xs" color="white" /> : <MapPin size={18} />}
                  </button>
                </div>
                {form.location.lat && (
                  <p className="text-[10px] text-emerald-600 font-black mt-2 uppercase tracking-widest flex items-center gap-1">
                    <AlertCircle size={12} /> GPS Coordinates Locked
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">04. Urgency</h2>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${form.priority === p
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Evidence */}
            <section>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">05. Visual Evidence</h2>
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-2">
                <ImageUpload images={form.images} onImagesChange={(images) => setForm({ ...form, images })} />
              </div>
            </section>

            {/* Submission */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
              >
                Abort Report
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? <Spinner size="sm" color="white" /> : <><Send size={18} /> Transmit Protocol</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;