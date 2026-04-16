import { Link } from 'react-router-dom';

export default function Topbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 glass-morphism px-8 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-main to-brand-accent shadow-lg shadow-indigo-500/20" />
          <Link to="/" className="text-xl font-bold tracking-tight text-brand-text transition hover:opacity-80">
            Store Rating <span className="text-brand-main">Platform</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <div className="mr-2 hidden flex-col items-end sm:flex">
                <span className="text-xs font-medium text-brand-text/50 uppercase tracking-wider">Account</span>
                <span className="text-sm font-semibold text-brand-text">{user.name}</span>
              </div>
              <Link to={`/${user.role}`} className="btn-sm bg-brand-main text-white hover:bg-brand-mainHover shadow-lg shadow-indigo-500/10">
                Dashboard
              </Link>
              <Link to="/password" className="btn-sm border border-white/10 bg-white/5 text-brand-text hover:bg-white/10">
                Settings
              </Link>
              <button onClick={onLogout} className="btn-sm bg-status-error/10 text-status-error border border-status-error/20 hover:bg-status-error/20">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-sm text-brand-text hover:text-brand-main transition">
                Sign In
              </Link>
              <Link to="/register" className="btn-sm bg-brand-main text-white hover:bg-brand-mainHover shadow-lg shadow-indigo-500/20">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
