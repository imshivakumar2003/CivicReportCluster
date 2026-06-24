import React from 'react';

const ComplaintTimeline = ({ complaint }) => {
    const events = [];

    // Submitted event
    events.push({
        date: new Date(complaint.createdAt),
        status: 'Submitted',
        icon: '📝',
        color: 'blue'
    });

    // First update (assumed if not pending)
    if (complaint.status !== 'Pending') {
        const midDate = new Date(complaint.createdAt);
        midDate.setDate(midDate.getDate() + Math.random() * 5);
        events.push({
            date: midDate,
            status: 'In Progress',
            icon: '⚙️',
            color: 'yellow'
        });
    }

    // Resolved event
    if (complaint.status === 'Resolved') {
        events.push({
            date: new Date(complaint.updatedAt),
            status: 'Resolved',
            icon: '✅',
            color: 'green'
        });
    }

    const formatDate = (date) => date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const daysElapsed = Math.floor((new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24));

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">📈 Timeline</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {daysElapsed} days
                </span>
            </div>

            <div className="space-y-4">
                {events.map((event, idx) => {
                    const colorMap = {
                        blue: 'bg-blue-100 text-blue-600 border-blue-300',
                        yellow: 'bg-yellow-100 text-yellow-600 border-yellow-300',
                        green: 'bg-green-100 text-green-600 border-green-300'
                    };

                    return (
                        <div key={idx} className="flex gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${colorMap[event.color]}`}>
                                <span className="text-lg">{event.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <p className="font-semibold text-gray-900">{event.status}</p>
                                <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                            </div>

                            {/* Line */}
                            {idx < events.length - 1 && (
                                <div className="absolute left-5 top-20 w-0.5 h-16 bg-gradient-to-b from-gray-200 to-transparent" />
                            )}
                        </div>
                    );
                })}
            </div>

            {complaint.daysToResolve && complaint.status === 'Resolved' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-700">
                        ✅ Resolved in {complaint.daysToResolve} days
                    </p>
                </div>
            )}
        </div>
    );
};

export default ComplaintTimeline;
