import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContextValue';
import { ThemeContext } from '../context/themeContextValue';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout'); 
            setUser(null); 
            toast.success("Logged out successfully");
            setMenuOpen(false);
            navigate('/login');
        } catch {
            toast.error("Logout failed");
        }
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85 sm:px-6">
            <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between">
                <Link to="/" onClick={() => setMenuOpen(false)} className="group transition-transform hover:scale-[1.02]" aria-label="Eventora home">
                    <BrandLogo />
                </Link>

                <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation menu" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200 md:hidden">
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className={`${menuOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[4.5rem] flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:dark:bg-transparent`}>
                    <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">Home</Link>

                    {!user ? (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">Login</Link>
                            <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-lg bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-cyan-500 hover:text-slate-950 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300">Create account</Link>
                        </>
                    ) : (
                        <>
                            <span className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 md:block" />
                            <span className="px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400">Hi, {user.name}</span>
                            {user.role === 'SuperAdmin' && <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">Dashboard</Link>}
                            {user.role === 'Organizer' && <Link to="/organizer/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">My events</Link>}
                            {user.role === 'Participant' && <Link to="/participant/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">My bookings</Link>}
                            <button type="button" onClick={handleLogout} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40"><LogOut size={16} /> Logout</button>
                        </>
                    )}
                    <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-200 dark:hover:text-cyan-300 md:ml-2">
                        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        <span className="md:hidden">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
