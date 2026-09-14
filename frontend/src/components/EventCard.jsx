import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <img 
                src={event.bannerImage || "https://via.placeholder.com/400x200?text=No+Image"} 
                alt={event.title} 
                className="w-full h-48 object-cover"
            />
            <div className="p-5">
                <h3 className="mb-2 break-words text-xl font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="mb-4 flex flex-wrap items-start gap-x-4 gap-y-2 text-sm text-gray-600">
                    <span className="flex items-start gap-1">
                        📅 {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex min-w-0 items-start gap-1 break-words">
                        📍 {event.location}
                    </span>
                </div>
                
                <Link to={`/event/${event._id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EventCard;