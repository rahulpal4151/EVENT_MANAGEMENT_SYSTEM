import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';
import { BarChart3, CalendarCheck, ShieldCheck, Users } from 'lucide-react';

const platformFeatures = [
    {
        title: 'Discover With Confidence',
        description: 'Find well-organized hackathons and events that are worth your time.',
        icon: ShieldCheck,
        iconClass: 'text-cyan-500',
    },
    {
        title: 'One Place, Every Event',
        description: 'Browse event details, dates, and booking information without the busywork.',
        icon: CalendarCheck,
        iconClass: 'text-emerald-500',
    },
    {
        title: 'Built for Participation',
        description: 'Book your spot quickly and keep track of the events you are joining.',
        icon: Users,
        iconClass: 'text-violet-500',
    },
    {
        title: 'Make Every Event Count',
        description: 'Organizers get a simple way to reach participants and manage registrations.',
        icon: BarChart3,
        iconClass: 'text-orange-500',
    },
];

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.get('/events/all-events');
            setEvents(response.data.events || response.data);
        } catch (error) {
            setError('We could not load events right now.');
            toast.error("Failed to load events");
            console.error("Fetch events error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchEvents, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Discover Top Hackathons
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Find and participate in the best coding events around you.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-xl text-gray-600 mt-20">Loading events...</div>
            ) : error ? (
                <div className="text-center mt-20">
                    <p className="text-xl text-red-600 mb-4">{error}</p>
                    <button type="button" onClick={fetchEvents} className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800">
                        Try again
                    </button>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center text-xl text-gray-600 mt-20">No events found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}

            <section className="mt-24 border-t border-slate-200/80 pt-16 dark:border-slate-800/80" aria-labelledby="platform-features-heading">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Why Eventora</p>
                    <h2 id="platform-features-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                        Built for better events
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                        Everything you need to discover, join, and run memorable hackathons in one focused experience.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {platformFeatures.map(({ title, description, icon: Icon, iconClass }) => (
                        <article key={title} className="group min-h-64 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none dark:hover:border-slate-700">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 ${iconClass} transition-transform duration-300 group-hover:scale-105 dark:bg-slate-800`}>
                                <Icon size={30} strokeWidth={2.2} />
                            </div>
                            <h3 className="mt-7 text-xl font-bold leading-tight text-slate-950 dark:text-white">{title}</h3>
                            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;