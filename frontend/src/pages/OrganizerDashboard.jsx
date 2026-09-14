import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { AuthContext } from '../context/authContextValue';

const OrganizerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingApplication, setUpdatingApplication] = useState(null);
    const [deletingEvent, setDeletingEvent] = useState(null);

    const fetchDashboardData = async () => {
        setError('');
        setLoading(true);
        try {
            const [eventsResponse, applicationsResponse] = await Promise.all([
                axiosInstance.get('/events/my-events'),
                axiosInstance.get('/bookings/organizer-applications')
            ]);
            setEvents(eventsResponse.data.events || eventsResponse.data);
            setApplications(applicationsResponse.data.applications || []);
        } catch {
            setError('We could not load your organizer dashboard.');
            toast.error("Failed to load your dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchDashboardData, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    const updateApplicationStatus = async (bookingId, status) => {
        setUpdatingApplication(bookingId);
        try {
            const response = await axiosInstance.put(`/bookings/${bookingId}/status`, { status });
            setApplications((currentApplications) => currentApplications.map((application) => (
                application._id === bookingId ? response.data.booking : application
            )));
            toast.success(`Application ${status.toLowerCase()} successfully`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update application");
        } finally {
            setUpdatingApplication(null);
        }
    };

    const deleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }

        setDeletingEvent(eventId);
        try {
            await axiosInstance.delete(`/events/${eventId}`);
            setEvents((currentEvents) => currentEvents.filter((event) => event._id !== eventId));
            setApplications((currentApplications) => currentApplications.filter((application) => application.eventId?._id !== eventId));
            toast.success('Event deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete event');
        } finally {
            setDeletingEvent(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
                </div>
                <Link to="/organizer/create-event" className="w-full rounded-lg bg-blue-600 px-5 py-2 text-center font-medium text-white transition hover:bg-blue-700 sm:w-auto">
                    + Create New Event
                </Link>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 mt-10">Loading your events...</div>
            ) : error ? (
                <div className="bg-red-50 p-8 rounded-xl border border-red-100 text-center">
                    <p className="text-red-700 mb-4">{error}</p>
                    <button type="button" onClick={fetchDashboardData} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        Try again
                    </button>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                    <table className="min-w-[40rem] divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            type="button"
                                            onClick={() => deleteEvent(event._id)}
                                            disabled={deletingEvent === event._id}
                                            title="Delete event"
                                            aria-label={`Delete ${event.title}`}
                                            className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <section className="mt-10">
                <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Participant Applications</h2>
                        <p className="text-gray-600 mt-1">Review and respond to applications for your events.</p>
                    </div>
                    <span className="text-sm font-medium text-gray-500">{applications.length} total</span>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                        No participant applications yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((application) => (
                                        <tr key={application._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-medium text-gray-900">{application.participantId?.name || 'Unknown participant'}</p>
                                                <p className="text-sm text-gray-500">{application.participantId?.email || ''}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{application.eventId?.title || 'Unknown event'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(application.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${application.status === 'Approved' ? 'bg-green-100 text-green-800' : application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {application.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {application.status === 'Pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateApplicationStatus(application._id, 'Approved')}
                                                            disabled={updatingApplication === application._id}
                                                            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateApplicationStatus(application._id, 'Rejected')}
                                                            disabled={updatingApplication === application._id}
                                                            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Responded</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrganizerDashboard;