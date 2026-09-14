import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(() => sessionStorage.getItem('verificationEmail') || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            await axiosInstance.post('/auth/verify-otp', { email, otp });
            sessionStorage.removeItem('verificationEmail');
            toast.success('Email verified successfully. You can now log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
                <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900">Verify your email</h2>
                <p className="mb-6 text-center text-sm leading-6 text-gray-600">
                    Enter the 6-digit OTP sent to your email address.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="verification-email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                        <input id="verification-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="verification-otp" className="mb-1 block text-sm font-medium text-gray-700">OTP</label>
                        <input id="verification-otp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required className="w-full rounded-lg border border-gray-300 p-3 text-center text-2xl tracking-[0.35em] outline-none focus:ring-2 focus:ring-cyan-500" placeholder="000000" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-950 py-3 font-semibold text-white transition hover:bg-cyan-500 hover:text-slate-950 disabled:opacity-70">
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already verified? <Link to="/login" className="font-semibold text-cyan-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;
