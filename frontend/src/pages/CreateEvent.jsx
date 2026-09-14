import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: ''});
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form inputs handle karne ke liye
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // File input handle karne ke liye
    const handleFileChange = (e) => setImageFile(e.target.files[0]);
    
    // Cloudinary par image upload karne ka function
    const uploadImageToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);

        // .env se variables fetch karein
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        
        // Yahan Cloudinary Dashboard se "Upload Preset" ka naam daalein
        data.append("upload_preset", uploadPreset);
        // Yahan Cloudinary Dashboard se "Cloud Name" daalein
        data.append("cloud_name", cloudName);

        try {
            // Yahan URL mein bhi apna "Cloud Name" replace karein
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: data
            });
            const uploadedData = await response.json();
            return uploadedData.secure_url;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";
            // 1. Agar user ne image select ki hai, toh pehle Cloudinary pe upload karo
            if (imageFile) {
                toast.loading("Uploading image...", { id: "upload" });
                imageUrl = await uploadImageToCloudinary(imageFile);

                // Agar Cloudinary fail ho jaye toh form yahin rok do
                if (!imageUrl) {
                    toast.error("Image upload failed. Please try again.", { id: "upload" });
                    setLoading(false);
                    return; 
                }
                toast.success("Image uploaded!", { id: "upload" });
            }
            // 2. Ab poora data prepare karo jaisa backend expect kar raha hai
            const eventData = {
                ...formData,
                bannerImage: imageUrl
            };
            // 3. Apne backend API par final data bhejo (Endpoint verify kar lein)
            toast.loading("Creating event...", { id: "create" });
            await axiosInstance.post('/events/create-events', eventData);
            
            toast.success("Event created successfully! Waiting for Admin approval.", { id: "create" });
            navigate('/organizer/dashboard');

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to create event", { id: "create" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>
    
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input type="text" name="title" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Global Tech Hackathon" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" required rows="4" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tell us about the event..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" name="date" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input type="text" name="location" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. New Delhi, India" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Optional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="min-w-0 w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none file:mr-2 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 sm:file:mr-4 sm:file:px-4 sm:file:text-sm" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 mt-4">
                        {loading ? 'Processing...' : 'Submit Event for Approval'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;