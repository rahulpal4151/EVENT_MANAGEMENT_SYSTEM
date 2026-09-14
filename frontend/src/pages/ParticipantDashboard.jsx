import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/authContextValue';

const ParticipantDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.get('/bookings/my-bookings');
            setBookings(response.data.bookings || response.data);
        } catch (error) {
            setError('We could not load your applications right now.');
            toast.error("Failed to load your bookings");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchBookings, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-1">Hello {user?.name}, here are the events you applied for.</p>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 mt-10">Loading your bookings...</div>
            ) : error ? (
                <div className="bg-red-50 p-8 rounded-xl border border-red-100 text-center">
                    <p className="text-red-700 mb-4">{error}</p>
                    <button type="button" onClick={fetchBookings} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        Try again
                    </button>
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 mb-4">You haven't applied for any events yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            {booking.eventId?.bannerImage && (
                                <img src={booking.eventId.bannerImage} alt={booking.eventId.title} className="w-full h-36 object-cover rounded-lg mb-4" />
                            )}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{booking.eventId?.title || 'Unknown Event'}</h3>
                            <p className="text-sm text-gray-500">{booking.eventId?.location || 'Location pending'}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleDateString() : 'Date pending'}
                                {' · '}Applied {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.status === 'Approved' ? 'bg-green-100 text-green-800' : booking.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {booking.status}
                                </span>
                                {booking.eventId?._id && (
                                    <a href={`/event/${booking.eventId._id}`} className="text-blue-600 text-sm font-semibold hover:underline">
                                        View event
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParticipantDashboard;