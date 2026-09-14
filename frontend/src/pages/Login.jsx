import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/authContextValue';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Apna exact login endpoint yahan verify karein (e.g., /auth/login)
            const response = await axiosInstance.post('/auth/login', formData);
            
            if (response.data.success || response.status === 200) {
                const loggedInUser = response.data.user;
                
                // Context update karna (ye automatically localStorage me save ho jayega)
                setUser(loggedInUser); 
                toast.success(`Welcome back, ${loggedInUser.name}!`);

                // Role ke hisaab se sahi dashboard par bhejna
                if (loggedInUser.role === 'SuperAdmin') navigate('/admin/dashboard');
                else if (loggedInUser.role === 'Organizer') navigate('/organizer/dashboard');
                else navigate('/participant/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-70">
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up for free</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;