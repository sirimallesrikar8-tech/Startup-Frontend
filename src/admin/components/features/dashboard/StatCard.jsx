import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle, Star } from 'lucide-react';

const iconMap = {
    DollarSign,
    Calendar,
    AlertCircle,
    Star
};

const StatCard = ({ stat }) => {
    const Icon = iconMap[stat.icon] || DollarSign;
    const isPositive = stat.trend === 'up';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {stat.value}
                    </h3>
                    <div className="flex items-center gap-2">
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                            className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {stat.change}
                        </span>
                        <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                </div>
                <div className="ml-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
