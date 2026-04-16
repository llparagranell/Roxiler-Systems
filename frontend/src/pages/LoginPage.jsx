import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auth } from '../api.js';
import { Link } from 'react-router-dom';


const DEFAULT_SYSADMIN_EMAIL = 'sysadmin@example.com';
const DEFAULT_SYSADMIN_PASSWORD = 'Admin@1234';

export default function LoginPage({ onLogin }) {
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await auth.login(form);
      onLogin(data);
    } catch (err) {
      setError(err.message || 'Unable to login');
    }
  };

  return (
    <section className="mx-auto max-w-md w-full my-20 animate-fade-up">
      <div className="rounded-[2rem] border border-white/5 bg-brand-surface p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand-main/10 blur-[60px]" />

        <div className="relative z-10 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="mt-3 text-brand-text/60">Secure access to your dashboard</p>
          </div>

          {selectedRole && (
            <div className="rounded-lg bg-brand-main/10 px-4 py-2 border border-brand-main/20 text-center">
              <p className="text-sm font-semibold text-brand-main">Logging in as {selectedRole}</p>
            </div>
          )}

          <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">SysAdmin</span>
            <button
              type="button"
              onClick={() => setForm({ email: DEFAULT_SYSADMIN_EMAIL, password: DEFAULT_SYSADMIN_PASSWORD })}
              className="text-xs font-bold text-brand-main hover:text-brand-mainHover underline underline-offset-4 decoration-current"
            >
              Use demo credentials
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-status-error/10 border border-status-error/20 px-4 py-3 text-sm text-status-error text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-brand-text/60 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-brand-text/60 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08]"
                required
              />
            </div>

            <button className="btn-lg w-full bg-brand-main text-white hover:bg-brand-mainHover mt-6">
              Sign In to Account
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-brand-text/40">
              Don't have an account? {' '}
              <Link to="/register" className="text-brand-main hover:text-brand-mainHover font-semibold">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
