import { useEffect, useState } from 'react';
import { owner } from '../api.js';

function nextSortState(current, key) {
  if (current.sortBy !== key) return { sortBy: key, sortDir: 'asc' };
  return { sortBy: key, sortDir: current.sortDir === 'asc' ? 'desc' : 'asc' };
}

function SortHeader({ label, sortKey, sort, onChange }) {
  const active = sort.sortBy === sortKey;
  const indicator = active ? (sort.sortDir === 'asc' ? '↑' : '↓') : '';
  return (
    <th className="px-4 py-4 font-semibold text-brand-text/60">
      <button
        type="button"
        onClick={() => onChange(nextSortState(sort, sortKey))}
        className={`inline-flex items-center gap-2 transition hover:text-brand-main ${active ? 'text-brand-main' : ''}`}
      >
        <span>{label}</span>
        <span className="opacity-50">{indicator}</span>
      </button>
    </th>
  );
}

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [sort, setSort] = useState({ sortBy: 'created_at', sortDir: 'desc' });

  useEffect(() => {
    owner.dashboard(sort).then(setDashboard).catch((err) => setError(err.message || 'Unable to load owner dashboard'));
  }, [sort.sortBy, sort.sortDir]);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-brand-surface p-10 shadow-xl animate-fade-up">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand-main/10 blur-[80px]" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white tracking-tight">Business Intelligence</h2>
          <p className="mt-3 text-brand-text/60 max-w-xl">Monitor your store's performance through average ratings and detailed customer feedback.</p>
        </div>
      </section>
      {error && <div className="rounded-2xl bg-status-error px-4 py-3 text-brand-dark">{error}</div>}
      {dashboard ? (
        <section className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-[2rem] border border-white/5 bg-brand-surface p-10 shadow-xl relative overflow-hidden flex flex-col justify-center items-center text-center">
            <div className="absolute inset-0 bg-brand-main/5 pointer-events-none" />
            <p className="text-xs font-bold uppercase tracking-widest text-brand-main mb-4">Total Average Performance</p>
            <p className="text-8xl font-black text-white">{dashboard.averageRating}</p>
            <div className="mt-6 flex items-center gap-2 text-brand-text/40">
              <span className="text-2xl font-bold text-white/80">{dashboard.ratings.length}</span>
              <span className="text-sm font-medium uppercase tracking-wider">Reviews Received</span>
            </div>
          </div>
          
          <div className="lg:col-span-2 rounded-[2rem] border border-white/5 bg-brand-surface p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Recent Feedback</h3>
                <p className="mt-1 text-sm text-brand-text/40">Real-time customer ratings activity</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5">
              {dashboard.ratings.length ? (
                <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                  <thead className="bg-white/[0.02]">
                    <tr>
                      <SortHeader label="Customer" sortKey="name" sort={sort} onChange={setSort} />
                      <SortHeader label="Email" sortKey="email" sort={sort} onChange={setSort} />
                      <SortHeader label="Rating" sortKey="rating" sort={sort} onChange={setSort} />
                      <SortHeader label="Date" sortKey="created_at" sort={sort} onChange={setSort} />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dashboard.ratings.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-[10px] text-brand-text/30 uppercase tracking-tighter truncate max-w-[150px]">{item.address}</div>
                        </td>
                        <td className="px-4 py-4 text-brand-text/60 font-mono text-xs">{item.email}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center justify-center rounded-lg h-8 w-12 font-bold text-xs ${item.rating >= 4 ? 'bg-status-success/10 text-status-success' : item.rating >= 3 ? 'bg-brand-main/10 text-brand-main' : 'bg-status-error/10 text-status-error'}`}>
                            {item.rating} / 5
                          </span>
                        </td>
                        <td className="px-4 py-4 text-brand-text/40 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-brand-text/30 italic">Patience is a virtue—your first reviews are coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="py-20 text-center text-brand-text/40 animate-pulse">Synchronizing dashboard data...</div>
      )}
    </div>
  );
}

