import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Inline SVG icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m.2 2a3.8 3.8 0 00-3.8 3.8v8.4A3.8 3.8 0 008 20h8a3.8 3.8 0 003.8-3.8V7.8A3.8 3.8 0 0016 4H8m4 3a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5m0 2a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3m4.5-3.5a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2M8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75M19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const developers = [
  {
    name: 'I M Shivakumar',
    instagram: 'https://www.instagram.com/nickname_shivu?igsh=MXB3YW43Y3p0Z2d2eA==',
    linkedin: 'https://www.linkedin.com/in/i-m-shiva-kumar-8ba64b373?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: 'https://github.com/imshivakumar2003',
  },
  {
    name: 'Chaya B S',
    instagram: 'https://www.instagram.com/_shadow.c._?igsh=dm5ha2hoa3A3cjdy',
    linkedin: 'https://www.linkedin.com/in/chaya-bs-68ab2525b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: 'https://github.com/chayabs846',
  },
  {
    name: 'Kadli Sagar',
    instagram: 'https://www.instagram.com/sagar_kadli__?igsh=MXdwM29tdW13b2xiZA==',
    linkedin: 'https://www.linkedin.com/in/kadli-sagar-8a87a4412?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: 'https://github.com/kadlisagar',
  },
  {
    name: 'Roja M',
    instagram: 'https://www.instagram.com/_unavailable._2003_?igsh=bGZuN2g0dTNja21q',
    linkedin: '', // to be filled later
    github: 'https://github.com/rojamrojam667-sys',
  },
];

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
      <footer className="border-t border-gray-100 py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <span className="font-display font-bold text-gray-800">CivicPulse</span>
            </div>
            <p className="text-gray-400 text-sm">Crowdsourced Civic Issue Reporting Platform • Built for Internship 2026</p>
          </div>

          {/* Developers */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-6">Meet the Developers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {developers.map((dev, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-3">{dev.name}</h4>
                  <div className="flex items-center justify-center gap-3">
                    {dev.instagram && (
                      <a
                        href={dev.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500 transition-colors"
                        title="Instagram"
                      >
                        <InstagramIcon />
                      </a>
                    )}
                    {dev.linkedin ? (
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="LinkedIn"
                      >
                        <LinkedInIcon />
                      </a>
                    ) : (
                      <span className="text-gray-300 cursor-default" title="LinkedIn (coming soon)">
                        <LinkedInIcon />
                      </span>
                    )}
                    {dev.github && (
                      <a
                        href={dev.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        title="GitHub"
                      >
                        <GitHubIcon />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;