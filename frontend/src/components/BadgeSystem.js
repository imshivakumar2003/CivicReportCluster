import React, { useState, useEffect } from 'react';

const BadgeSystem = ({ userComplaints = [] }) => {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        calculateBadges();
    }, [userComplaints]);

    const calculateBadges = () => {
        const newBadges = [];
        const count = userComplaints.length;
        const resolvedCount = userComplaints.filter(c => c.status === 'Resolved').length;
        const hasHighPriority = userComplaints.some(c => c.priority === 'High');
        const hasImages = userComplaints.some(c => c.images && c.images.length > 0);
        const avgRating = userComplaints.reduce((sum, c) => sum + (c.rating || 0), 0) / Math.max(count, 1);

        // Reporting Badges
        if (count >= 1) newBadges.push({ id: 'first', emoji: '🎯', title: 'First Report', desc: 'Submitted first complaint' });
        if (count >= 5) newBadges.push({ id: 'active', emoji: '⚡', title: 'Active Citizen', desc: 'Submitted 5+ complaints' });
        if (count >= 10) newBadges.push({ id: 'advocate', emoji: '🏆', title: 'Civic Advocate', desc: 'Submitted 10+ complaints' });
        if (count >= 25) newBadges.push({ id: 'champion', emoji: '👑', title: 'Community Champion', desc: 'Submitted 25+ complaints' });

        // Resolution Badges
        if (resolvedCount >= 1) newBadges.push({ id: 'resolved1', emoji: '✅', title: 'Problem Solver', desc: 'Had 1 issue resolved' });
        if (resolvedCount >= 5) newBadges.push({ id: 'resolved5', emoji: '🎖️', title: 'Impact Maker', desc: 'Had 5 issues resolved' });

        // Quality Badges
        if (hasImages) newBadges.push({ id: 'photographer', emoji: '📸', title: 'Photographer', desc: 'Added photos to reports' });
        if (hasHighPriority) newBadges.push({ id: 'urgent', emoji: '🚨', title: 'Priority Alert', desc: 'Reported urgent issues' });
        if (avgRating >= 4.5) newBadges.push({ id: 'satisfied', emoji: '😊', title: 'Satisfied', desc: 'Average 4.5+ rating' });

        setBadges(newBadges);
    };

    if (badges.length === 0) {
        return (
            <div className="card p-6 text-center text-gray-500">
                <p className="text-4xl mb-2">🎖️</p>
                <p className="font-semibold">No badges yet</p>
                <p className="text-sm">Start reporting to earn achievements!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>🏅</span> Your Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {badges.map(badge => (
                    <div
                        key={badge.id}
                        className="card p-4 text-center hover:shadow-md transition-all cursor-pointer group"
                        title={badge.desc}
                    >
                        <p className="text-4xl mb-2 group-hover:scale-110 transition-transform">{badge.emoji}</p>
                        <p className="font-bold text-sm text-gray-900">{badge.title}</p>
                        <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {badge.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgeSystem;
