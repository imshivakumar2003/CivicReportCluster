import React from 'react';

/**
 * 🌀 Spinner: Modernized with a dual-ring pulse effect
 */
export const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    blue: 'border-blue-600/20 border-t-blue-600',
    white: 'border-white/20 border-t-white'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Glow/Pulse */}
      <div className={`${sizes[size]} absolute rounded-full border-4 border-transparent animate-pulse bg-blue-400/10`} />
      {/* Main Spinning Ring */}
      <div className={`${sizes[size]} border-4 rounded-full animate-spin transition-all duration-500 ${colors[color]}`} />
    </div>
  );
};

/**
 * 🔔 Alert: Glassmorphism style with better typography
 */
export const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-white border-red-100 text-red-900 shadow-red-100/50',
    success: 'bg-white border-emerald-100 text-emerald-900 shadow-emerald-100/50',
    info: 'bg-white border-blue-100 text-blue-900 shadow-blue-100/50',
  };

  const icons = {
    error: <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-bold">!</div>,
    success: <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 text-lg">✓</div>,
    info: <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">i</div>
  };

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl border shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${styles[type]}`}>
      {icons[type]}
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">{type}</p>
        <p className="text-sm font-bold tracking-tight">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-colors opacity-40 hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * 🚀 PageLoader: Fullscreen immersive loader
 */
export const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
    <div className="relative">
      {/* Decorative background pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />

      {/* Animated Icon */}
      <div className="relative w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-2xl animate-spin mb-6 shadow-2xl" />
    </div>

    <div className="text-center">
      <h2 className="font-black text-slate-900 tracking-widest uppercase text-xs mb-1">Authenticating Node</h2>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] animate-pulse">Initializing CivicPulse 2.0</p>
    </div>
  </div>
);