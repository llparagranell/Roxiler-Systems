import { useState } from 'react';
import { auth } from '../api.js';
import { Link } from 'react-router-dom';

export default function RegisterPage({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await auth.signup(form);
      onLogin(data);
    } catch (err) {
      setError(err.message || 'Unable to sign up');
    }
  };

  return (
    <section className="mx-auto max-w-lg w-full my-12 animate-fade-up">
      <div className="rounded-[2.5rem] border border-white/5 bg-brand-surface p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-brand-accent/10 blur-[60px]" />

        <div className="relative z-10 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="mt-3 text-brand-text/60">Join the platform to rate and manage stores</p>
          </div>

          {error && (
            <div className="rounded-xl bg-status-error/10 border border-status-error/20 px-4 py-3 text-sm text-status-error text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-text/60 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08]"
                  minLength={2}
                  maxLength={60}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-text/60 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-brand-text/60 ml-1">Address</label>
              <textarea
                placeholder="123 Store Street, City, Country"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08] resize-none"
                maxLength={400}
                rows={3}
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
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08]"
                minLength={8}
                maxLength={16}
                required
              />
            </div>

            <button className="btn-lg w-full bg-brand-main text-white hover:bg-brand-mainHover mt-4">
              Create My Account
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-brand-text/40">
              Already have an account? {' '}
              <Link to="/login" className="text-brand-main hover:text-brand-mainHover font-semibold">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
