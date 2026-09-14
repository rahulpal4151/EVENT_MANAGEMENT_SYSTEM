import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/authContextValue';
import toast from 'react-hot-toast';

const EventDetails = () => {
    const { id } = useParams(); // URL se event ID nikalna
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applying, setApplying] = useState(false);

    const fetchEventDetails = useCallback(async () => {
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/events/${id}`);
            setEvent(response.data.event || response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load event details.');
            toast.error("Failed to load event details");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const timeoutId = setTimeout(fetchEventDetails, 0);
        return () => clearTimeout(timeoutId);
    }, [fetchEventDetails]);

    // Apply karne ka function
    const handleApply = async () => {
        // Agar user login nahi hai, toh pehle login page par bhejo
        if (!user) {
            toast.error("Please login to apply for this event");
            navigate('/login');
            return;
        }

        // Sirf Participants apply kar sakte hain
        if (user.role !== 'Participant') {
            toast.error("Only participants can apply for events");
            return;
        }

        setApplying(true);
        try {
            // Yahan apna exact booking endpoint daalein
            await axiosInstance.post(`/bookings/apply/${id}`);
            toast.success("Successfully applied for the event!");
            navigate('/participant/dashboard'); // Apply hone ke baad dashboard bhej do
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply. You might have already applied.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="text-center text-xl mt-20">Loading event details...</div>;
    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-xl text-red-500 mb-4">{error}</p>
                <button type="button" onClick={fetchEventDetails} className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800">
                    Try again
                </button>
            </div>
        );
    }
    if (!event) return <div className="text-center text-xl mt-20 text-red-500">Event not found!</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {event.bannerImage ? (
                    <img src={event.bannerImage} alt={event.title} className="w-full h-40 md:h-56 object-cover bg-gray-100" />
                ) : (
                    <div className="w-full h-40 md:h-56 bg-gray-100 flex items-center justify-center text-gray-500">No banner image</div>
                )}

                <div className="p-6">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h1 className="min-w-0 break-words text-2xl font-extrabold text-gray-900 md:text-3xl">{event.title}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {event.status || 'Pending'}
                        </span>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-x-4 gap-y-3 border-b pb-4 text-gray-600">
                        <div className="flex min-w-0 items-start gap-2">
                            <span className="text-lg">📅</span>
                            <span className="font-medium text-sm">{new Date(event.date).toDateString()}</span>
                        </div>
                        <div className="flex min-w-0 items-start gap-2">
                            <span className="text-lg">📍</span>
                            <span className="break-words text-sm font-medium">{event.location}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">About the Event</h2>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        {user?.role === 'Organizer' || user?.role === 'SuperAdmin' ? (
                            <p className="text-sm text-gray-600">You are logged in as {user.role}. Only Participants can apply.</p>
                        ) : (
                            <button 
                                onClick={handleApply}
                                disabled={applying || event.status !== 'Approved'}
                                className="w-full px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {applying ? 'Applying...' : event.status !== 'Approved' ? 'Event not active' : 'Apply Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;