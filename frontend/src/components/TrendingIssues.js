import React, { useState } from 'react';
import HotspotsMap from './HotspotsMap';
import { MapPin, Navigation } from 'lucide-react';

const TrendingIssues = ({ complaints = [] }) => {
    const [selectedCoords, setSelectedCoords] = useState(null);

    // Safety check: If complaints is null or not an array, show a loading state
    if (!Array.isArray(complaints)) {
        return (
            <div className="h-96 flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Geospatial Data...</p>
                </div>
            </div>
        );
    }

    // Filter only high priority issues for the "Hotspots" list
    const highPriorityIssues = complaints.filter(c => c.priority === 'High');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* --- Left Column: List of High-Traffic Issues --- */}
            <div className="lg:col-span-4 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Navigation size={14} /> Critical Hotspots
                </h3>

                {highPriorityIssues.length > 0 ? (
                    highPriorityIssues.map((c) => (
                        <button
                            key={c._id}
                            onClick={() => {
                                if (c.location?.coordinates) {
                                    setSelectedCoords(c.location.coordinates);
                                }
                            }}
                            className="w-full text-left bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                                    Critical
                                </span>
                                <MapPin size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <p className="text-sm font-black text-slate-900 line-clamp-1">{c.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                                {c.location?.address || 'Location Coordinates Encrypted'}
                            </p>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No High-Priority Alerts</p>
                    </div>
                )}
            </div>

            {/* --- Right Column: Interactive Map View --- */}
            <div className="lg:col-span-8">
                <div className="mb-4 flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Geospatial Tracker</p>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Satellite Link Active
                    </span>
                </div>

                {/* The Actual Leaflet Map Component */}
                <HotspotsMap complaints={complaints} activeLocation={selectedCoords} />

                {/* Map Footer Info */}
                <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                        <span className="font-black mr-2">PRO TIP:</span>
                        Click on a critical hotspot card to automatically fly the camera to the incident location.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrendingIssues;