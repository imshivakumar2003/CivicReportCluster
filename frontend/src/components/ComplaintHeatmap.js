import React, { useState, useEffect } from 'react';
import { complaintsAPI } from '../api';
import { Spinner } from './UI';

const ComplaintHeatmap = () => {
    const [categoryStats, setCategoryStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryDensity();
    }, []);

    const fetchCategoryDensity = async () => {
        try {
            const { data } = await complaintsAPI.getAll();
            const stats = {};

            data.forEach(complaint => {
                const cat = complaint.category;
                stats[cat] = (stats[cat] || 0) + 1;
            });

            setCategoryStats(stats);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    const maxCount = Math.max(...Object.values(categoryStats), 1);
    const categories = [
        { name: 'Roads', emoji: '🛣️' },
        { name: 'Water Supply', emoji: '💧' },
        { name: 'Electricity', emoji: '⚡' },
        { name: 'Sanitation', emoji: '🗑️' },
        { name: 'Public Safety', emoji: '🚨' },
        { name: 'Parks', emoji: '🌳' },
        { name: 'Other', emoji: '📋' }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(cat => {
                const count = categoryStats[cat.name] || 0;
                const intensity = (count / maxCount) * 100;
                const bgColor = intensity > 66 ? 'bg-red-200' : intensity > 33 ? 'bg-yellow-200' : 'bg-green-200';
                const textColor = intensity > 66 ? 'text-red-700' : intensity > 33 ? 'text-yellow-700' : 'text-green-700';

                return (
                    <div
                        key={cat.name}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${bgColor} cursor-pointer hover:shadow-md`}
                        style={{ opacity: 0.5 + (intensity / 200) }}
                    >
                        <p className="text-3xl mb-2">{cat.emoji}</p>
                        <p className={`text-2xl font-bold ${textColor}`}>{count}</p>
                        <p className="text-xs text-gray-600 mt-1">{cat.name}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default ComplaintHeatmap;
