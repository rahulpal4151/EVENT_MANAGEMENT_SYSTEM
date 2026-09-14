import { Sparkles } from 'lucide-react';

const BrandLogo = ({ compact = false }) => (
    <span className="inline-flex items-center gap-2.5" aria-label="Eventora">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-600 text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(79,70,229,0.3)]">
            E
            <Sparkles className="absolute -right-1 -top-1 text-cyan-200" size={12} strokeWidth={3} aria-hidden="true" />
        </span>
        {!compact && (
            <span className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-[-0.06em] text-slate-950 dark:text-white">
                    Event<span className="text-blue-600 dark:text-blue-400">ora</span>
                </span>
                <span className="mt-1 text-[0.58rem] font-bold tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    EVENT EXPERIENCES
                </span>
            </span>
        )}
    </span>
);

export default BrandLogo;
