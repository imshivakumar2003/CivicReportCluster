import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: '📍', title: 'GPS Location', desc: 'Pin exact issue location using your device GPS or enter address manually' },
    { icon: '📊', title: 'Live Tracking', desc: 'Track your complaint status from Pending to Resolved in real-time' },
    { icon: '🏛️', title: 'Gov Dashboard', desc: 'Dedicated admin panel for officials to manage and resolve complaints' },
    { icon: '🔔', title: 'Priority System', desc: 'Mark issues as High, Medium or Low priority for faster response' },
  ];

  const categories = [
    { icon: '🛣️', label: 'Roads', count: 'Potholes, Damage' },
    { icon: '💧', label: 'Water Supply', count: 'Leaks, Shortages' },
    { icon: '⚡', label: 'Electricity', count: 'Outages, Faults' },
    { icon: '🗑️', label: 'Sanitation', count: 'Waste, Drainage' },
    { icon: '🚨', label: 'Public Safety', count: 'Hazards, Risks' },
    { icon: '🌳', label: 'Parks', count: 'Maintenance' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Empowering citizens across India
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4 leading-tight">
              Report Civic Issues<br />
              <span className="text-blue-300">Get Them Resolved</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
              CivicPulse connects citizens with government authorities to report, track, and resolve local civic issues quickly and transparently.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/30 hover:scale-105"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/30 hover:scale-105">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-y border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { num: '10K+', label: 'Issues Reported' },
              { num: '85%', label: 'Resolution Rate' },
              { num: '48h', label: 'Avg Response Time' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-blue-600">{s.num}</p>
                <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold text-center text-gray-900 mb-2">Report Any Civic Issue</h2>
        <p className="text-gray-500 text-center mb-8">From roads to public safety — we cover it all</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(c => (
            <div key={c.label} className="card-hover p-4 text-center group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{c.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-center text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-500 text-center mb-10">Simple, transparent, effective</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="text-center group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  {f.icon}
                </div>
                <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-3">{i + 1}</div>
                <h3 className="font-display font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="card p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
            <h2 className="font-display text-3xl font-bold mb-3">Ready to Make Your City Better?</h2>
            <p className="text-blue-100 mb-6">Join CivicPulse and start reporting issues that matter to you and your community.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all hover:scale-105">
              Create Free Account →
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <span className="font-display font-bold text-gray-800">CivicPulse</span>
        </div>
        <p className="text-gray-400 text-sm">Crowdsourced Civic Issue Reporting Platform • Built for SIH 2024</p>
      </footer>
    </div>
  );
};

export default Home;
