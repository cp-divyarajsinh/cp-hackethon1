import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PhoneCall, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/calls', label: 'Calls', icon: PhoneCall },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] border-r border-[var(--border)] bg-[var(--bg-surface)] flex flex-col">
      <div className="p-5 flex items-center gap-2 border-b border-[var(--border)]">
        <WaveIcon className="text-[var(--accent)] shrink-0" />
        <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">CallIQ</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border-l-[3px] border-[var(--accent)] pl-[9px]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] border-l-[3px] border-transparent pl-[9px]'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-xs text-[var(--text-tertiary)]">v1.0 · Hackathon</div>
    </aside>
  );
}

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
