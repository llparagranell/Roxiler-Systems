import { useState } from 'react';
import { auth } from '../api.js';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await auth.updatePassword(password);
      setMessage('Password updated successfully.');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Unable to update password.');
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-brand-surface p-12 shadow-2xl animate-fade-up max-w-2xl mx-auto">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand-main/10 blur-[80px]" />
      <div className="relative z-10 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Security & Privacy</h1>
        <p className="mt-2 text-brand-text/60">Manage your credentials to keep your account secure.</p>
      </div>
      {(error || message) && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border mb-6 ${error ? 'bg-status-error/10 border-status-error/20 text-status-error' : 'bg-status-success/10 border-status-success/20 text-status-success'}`}>
          {error || message}
        </div>
      )}
      <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-brand-text/30 ml-1">New Secure Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08]"
            placeholder="Min. 8 characters..."
            minLength={8}
            maxLength={16}
            required
          />
        </div>
        <button className="btn-lg w-full bg-brand-main text-white hover:bg-brand-mainHover shadow-lg shadow-indigo-500/10 py-5">
          Update Security Key
        </button>
      </form>
    </section>
  );
}
