import React from 'react';
import { Calendar, CreditCard, Store, UserPlus, ArrowRight } from 'lucide-react';

const activityIconMap = {
    booking: Calendar,
    payment: CreditCard,
    vendor: Store,
    user: UserPlus
};

const activityColorMap = {
    booking: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    payment: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    vendor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    user: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
};

const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

const RecentActivity = ({ activities }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                </h3>
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">
                    View All
                </span>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar">
                {activities.slice(0, 6).map((activity) => {
                    const Icon = activityIconMap[activity.type] || Calendar;
                    const colorClass = activityColorMap[activity.type] || activityColorMap.booking;

                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer group"
                        >
                            <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {activity.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {getRelativeTime(activity.timestamp)}
                                </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-2" />
                        </div>
                    );
                })}
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-200">
                View All Activity
            </button>
        </div>
    );
};

export default RecentActivity;
