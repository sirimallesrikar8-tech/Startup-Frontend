import React from 'react';
import { Eye, MoreVertical } from 'lucide-react';

const statusColorMap = {
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

const BookingTable = ({ bookings }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Booking Requests
                </h3>
                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All Bookings
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Service
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.slice(0, 7).map((booking, index) => (
                            <tr
                                key={booking.id}
                                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                            {booking.client.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {booking.client}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {booking.clientEmail}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                                        {booking.eventName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {booking.eventType}
                                    </p>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {formatDate(booking.eventDate)}
                                    </p>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {booking.totalAmount}
                                    </p>
                                </td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColorMap[booking.status]
                                            }`}
                                    >
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingTable;
