import { useEffect, useRef, useState } from 'react';
import { user } from '../api.js';

const inputClass = 'block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-white/[0.08] text-sm';
const buttonClass = 'btn-sm bg-brand-main text-white hover:bg-brand-mainHover shadow-lg shadow-indigo-500/10 whitespace-nowrap px-8';

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);
  const [sort, setSort] = useState({ sortBy: 'name', sortDir: 'asc' });

  const loadStores = async (nextFilters = filters, nextSort = sort) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const data = await user.stores({ ...nextFilters, ...nextSort });
      if (requestId === requestIdRef.current) {
        setStores(data.stores);
      }
    } catch (err) {
      setError(err.message || 'Unable to load stores');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      loadStores(filters, sort);
    }, 300);

    return () => clearTimeout(handle);
  }, [filters.name, filters.address, sort.sortBy, sort.sortDir]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const nextFilters = {
      name: String(formData.get('name') || ''),
      address: String(formData.get('address') || ''),
    };

    setFilters(nextFilters);
    await loadStores(nextFilters, sort);
  };

  const handleRating = async (storeId, rating, existing) => {
    setError('');
    setMessage('');
    try {
      if (existing) {
        await user.updateRating(storeId, rating);
        setMessage('Rating updated successfully');
      } else {
        await user.rate(storeId, rating);
        setMessage('Rating submitted successfully');
      }
      loadStores();
    } catch (err) {
      setError(err.message || 'Unable to save rating');
    }
  };

  return (
    <>
      <section className="rounded-[2rem] border border-white/5 bg-brand-surface p-8 shadow-xl animate-fade-up">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Explore Stores</h2>
            <p className="mt-2 text-brand-text/60">Find and rate your favorite local establishments</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10 min-w-[200px] font-medium border-brand-main/20 bg-brand-main/5`}
                value={sort.sortBy}
                onChange={(e) => setSort((prev) => ({ ...prev, sortBy: e.target.value }))}
              >
                <option value="name" className="bg-brand-surface">Name</option>
                <option value="address" className="bg-brand-surface">Location</option>
                <option value="overall_rating" className="bg-brand-surface">Overall Rating</option>
                <option value="user_rating" className="bg-brand-surface">Your Rating</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-main">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <button
              type="button"
              className="btn-sm bg-white/5 border border-white/10 text-white hover:bg-white/10"
              onClick={() => setSort((prev) => ({ ...prev, sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc' }))}
            >
              {sort.sortDir === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
            </button>
          </div>
        </div>
        
        <form className="flex flex-col gap-4 md:flex-row" onSubmit={handleSearch}>
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              name="name"
              className={`${inputClass} pl-12`}
              placeholder="Store name..."
              value={filters.name}
              onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <input
              name="address"
              className={`${inputClass} pl-12`}
              placeholder="Search by address..."
              value={filters.address}
              onChange={(e) => setFilters((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <button type="submit" className={buttonClass} disabled={loading}>
            {loading ? 'Processing...' : 'Search Stores'}
          </button>
        </form>
      </section>

      {(error || message) && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border animate-fade-in ${error ? 'bg-status-error/10 border-status-error/20 text-status-error' : 'bg-status-success/10 border-status-success/20 text-status-success'}`}>
          {error || message}
        </div>
      )}
      <section className="grid gap-6">
        {stores.map((store) => (
          <article key={store.id} className="group relative rounded-[2rem] border border-white/5 bg-brand-surface p-8 shadow-xl transition-all duration-300 hover:border-brand-main/20 animate-fade-up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-white tracking-tight">{store.name}</h3>
                  <div className="rounded-full bg-brand-main/10 px-3 py-1 text-xs font-bold text-brand-main uppercase tracking-widest">
                    ★ {store.overall_rating}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-brand-text/50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm">{store.address}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-center sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-text/30 mb-1">Your Personal Rating</p>
                  <p className="text-xl font-extrabold text-white">
                    {store.user_rating ? (
                      <span className="text-brand-main">{store.user_rating} <span className="text-brand-text/20 text-sm">/ 5</span></span>
                    ) : (
                      <span className="text-brand-text/20 italic">Not rated yet</span>
                    )}
                  </p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden sm:block mx-2" />
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      title={`Rate ${rating} stars`}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${store.user_rating === rating ? 'bg-brand-main text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-brand-text/40 hover:bg-white/10 hover:text-brand-text'}`}
                      onClick={() => handleRating(store.id, rating, Boolean(store.user_rating))}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}

      </section>
    </>
  );
}
