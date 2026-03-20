import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { healthCheck } from '@/lib/api';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/upload': 'Upload',
  '/calls': 'Call Library',
};

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let alive = true;
    healthCheck().then((v) => {
      if (alive) setOk(v);
    });
    const t = setInterval(() => {
      healthCheck().then((v) => {
        if (alive) setOk(v);
      });
    }, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const title =
    pathname.startsWith('/calls/') && pathname !== '/calls'
      ? 'Call Analysis'
      : titles[pathname] ?? 'CallIQ';

  return (
    <header className="h-[60px] shrink-0 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg-base)]/80 backdrop-blur-sm">
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: ok ? 'var(--success)' : 'var(--danger)' }}
            title={ok ? 'API reachable' : 'API offline'}
          />
          <span className={ok ? 'health-pulse' : ''}>{ok ? 'Live' : 'Offline'}</span>
        </div>
        <Button asChild size="sm">
          <Link to="/upload">Upload Call</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={async () => {
            await logout();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
        {user && (
          <span className="text-xs text-[var(--text-tertiary)] mono hidden sm:inline">{user}</span>
        )}
      </div>
    </header>
  );
}
