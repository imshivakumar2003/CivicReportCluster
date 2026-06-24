import React, { useState, useEffect } from 'react';
import { complaintsAPI } from '../api';
import { Spinner } from './UI';
import { BarChart3, Star, AlertTriangle, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const PRIORITY_COLORS = { High: 'bg-red-500', Medium: 'bg-amber-500', Low: 'bg-emerald-500' };

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await complaintsAPI.getAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner /></div>;
    if (!analytics) return <div className="p-20 text-center font-black text-slate-300 uppercase">No Data Records</div>;

    const { categoryStats = [], avgRating = 0, priorityBreakdown = [] } = analytics;
    const maxCount = Math.max(...categoryStats.map(s => s.count), 1);
    const totalPriority = priorityBreakdown.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="space-y-6 antialiased pb-10 animate-in fade-in duration-500">
            {/* Top Row: Quick Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Satisfaction</p>
                        <p className="text-3xl font-black text-slate-900">{avgRating?.toFixed(1) || '0.0'}</p>
                        <div className="flex text-amber-400 mt-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.round(avgRating) ? "currentColor" : "none"} />)}
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500"><Star size={24} /></div>
                </div>

                <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-slate-200">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Critical Response</p>
                        <p className="text-3xl font-black">{priorityBreakdown.find(p => p._id === 'High')?.count || 0}</p>
                        <p className="text-[10px] font-bold text-red-400 uppercase mt-1">Immediate Action</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-red-400 animate-pulse"><AlertTriangle size={24} /></div>
                </div>

                <div className="bg-blue-600 p-6 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-blue-100">
                    <div>
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Resolution Rate</p>
                        <p className="text-3xl font-black">94.2%</p>
                        <p className="text-[10px] font-bold text-blue-100 uppercase mt-1">Global Efficiency</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white"><TrendingUp size={24} /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Bar Chart (Pure CSS) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-10">
                        <BarChart3 size={18} className="text-blue-600" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Incident Distribution</h3>
                    </div>
                    <div className="flex items-end justify-between h-64 px-2 gap-4">
                        {categoryStats.map((item) => (
                            <div key={item._id} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex justify-center items-end h-48">
                                    <div
                                        style={{ height: `${(item.count / maxCount) * 100}%` }}
                                        className="w-full max-w-[40px] bg-blue-600 rounded-t-xl transition-all duration-700 group-hover:bg-blue-400 relative"
                                    >
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.count}
                                        </span>
                                    </div>
                                </div>
                                <span className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-center line-clamp-1 truncate w-full">
                                    {item._id}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priority Breakdown (Pure CSS) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-10">
                        <PieIcon size={18} className="text-indigo-600" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Priority Weight</h3>
                    </div>
                    <div className="space-y-6">
                        {priorityBreakdown.map((item) => (
                            <div key={item._id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item._id}</span>
                                    <span className="text-xs font-black text-slate-900">{Math.round((item.count / totalPriority) * 100)}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${PRIORITY_COLORS[item._id] || 'bg-slate-400'} transition-all duration-1000`}
                                        style={{ width: `${(item.count / totalPriority) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                            Total Processed Nodes: {totalPriority}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;