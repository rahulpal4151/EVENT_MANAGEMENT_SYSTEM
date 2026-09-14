import { Globe2, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const Footer = () => (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
            <div>
                <Link to="/" className="transition-transform hover:scale-[1.02]" aria-label="Eventora home">
                    <BrandLogo />
                </Link>
                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Find ambitious people, build bold ideas, and make your next event count.
                </p>
            </div>
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-white">Explore</h2>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Link to="/" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">Discover events</Link>
                    <Link to="/signup" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">Join Eventora</Link>
                    <Link to="/login" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">Sign in</Link>
                </div>
            </div>
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-white">Stay connected</h2>
                <div className="mt-4 flex items-center gap-3">
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rahulpal4151@gmail.com" target="_blank" rel="noreferrer" aria-label="Email Eventora" title="Email Eventora" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-cyan-300"><Mail size={16} /></a>
                    <a href="https://github.com" aria-label="Eventora community" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-cyan-300"><Globe2 size={16} /></a>
                    <a href="https://linkedin.com/in/rahul-pal-952642334" aria-label="Eventora updates" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-cyan-300"><MessageCircle size={16} /></a>
                    
                </div>
            </div>
        </div>
        <div className="border-t border-slate-200/80 px-4 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
            © {new Date().getFullYear()} Eventora. Built for the people who make things happen.
        </div>
    </footer>
);

export default Footer;
