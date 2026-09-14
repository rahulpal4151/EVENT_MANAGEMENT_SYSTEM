import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

import { AuthContext } from '../context/authContextValue';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingEvent, setUpdatingEvent] = useState(null);

    const fetchAllEvents = async () => {
        setError('');
        try {
            const response = await axiosInstance.get('/admin/events');
            setEvents(response.data.events || response.data);
        } catch {
            setError('Failed to load platform events.');
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchAllEvents, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    const updateEventStatus = async (eventId, newStatus) => {
        setUpdatingEvent(eventId);
        try {
            await axiosInstance.put(`/admin/event-status/${eventId}`, { status: newStatus });
            toast.success(`Event marked as ${newStatus}`);
            fetchAllEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingEvent(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
                <p className="text-gray-600 mt-1">Welcome {user?.name}, manage pending events and review approved events here.</p>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 mt-10">Loading platform data...</div>
            ) : error ? (
                <div className="bg-red-50 p-8 rounded-xl border border-red-100 text-center">
                    <p className="text-red-700 mb-4">{error}</p>
                    <button type="button" onClick={fetchAllEvents} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        Try again
                    </button>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">No events found on the platform.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                    <table className="min-w-[40rem] divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{event.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'Approved' ? 'bg-green-100 text-green-800' : event.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {event.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {event.status === 'Pending' && (
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => updateEventStatus(event._id, 'Approved')}
                                                    disabled={updatingEvent === event._id}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => updateEventStatus(event._id, 'Rejected')}
                                                    disabled={updatingEvent === event._id}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {event.status === 'Approved' && (
                                            <span className="text-green-700">Approved</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;