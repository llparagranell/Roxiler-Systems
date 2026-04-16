import { useEffect, useState } from 'react';
import { admin } from '../api.js';

const fieldClass = 'block w-full rounded-xl border border-white/10 bg-brand-surface2/50 px-4 py-3 text-white placeholder-white/20 outline-none transition focus:border-brand-main focus:bg-brand-surface2 text-sm';
const buttonClass = 'btn-sm bg-brand-main text-white hover:bg-brand-mainHover shadow-lg shadow-indigo-500/10';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOptions, setStoreOptions] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'user', store_id: '' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserError, setSelectedUserError] = useState('');
  const [selectedUserLoading, setSelectedUserLoading] = useState(false);
  const [userSort, setUserSort] = useState({ sortBy: 'name', sortDir: 'asc' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', sortDir: 'asc' });

  useEffect(() => {
    admin.dashboard().then(setStats).catch((err) => setError(err.message || 'Unable to load stats'));
    loadUsers(filters, userSort);
    loadStores(storeFilters, storeSort);
    admin
      .stores({ name: '', email: '', address: '' })
      .then((data) => setStoreOptions(data.stores))
      .catch(() => setStoreOptions([]));
  }, []);

  const loadUsers = async (nextFilters = filters, nextSort = userSort) => {
    const data = await admin.users({ ...nextFilters, ...nextSort });
    setUsers(data.users);
  };

  const loadStores = async (nextFilters = storeFilters, nextSort = storeSort) => {
    const data = await admin.stores({ ...nextFilters, ...nextSort });
    setStores(data.stores);
  };

  const handleNewUser = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        password: newUser.password,
        role: newUser.role,
        ...(newUser.role === 'owner' ? { store_id: Number(newUser.store_id) } : {}),
      };
      await admin.createUser(payload);
      setMessage('User added successfully');
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user', store_id: '' });
      loadUsers(filters, userSort);
    } catch (err) {
      setError(err.message || 'Unable to create user');
    }
  };

  const handleNewStore = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await admin.createStore(newStore);
      setMessage('Store added successfully');
      setNewStore({ name: '', email: '', address: '' });
      loadStores(storeFilters, storeSort);
      admin
        .stores({ name: '', email: '', address: '' })
        .then((data) => setStoreOptions(data.stores))
        .catch(() => setStoreOptions([]));
    } catch (err) {
      setError(err.message || 'Unable to create store');
    }
  };

  const openUserDetails = async (userId) => {
    setSelectedUser(null);
    setSelectedUserError('');
    setSelectedUserLoading(true);
    try {
      const data = await admin.userById(userId);
      setSelectedUser(data.user);
    } catch (err) {
      setSelectedUserError(err.message || 'Unable to load user details');
    } finally {
      setSelectedUserLoading(false);
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setSelectedUserError('');
    setSelectedUserLoading(false);
  };

  return (
      <div className="space-y-8 animate-fade-in">
      <section className="grid gap-6 md:grid-cols-3">
        {stats ? (
          ['totalUsers', 'totalStores', 'totalRatings'].map((key) => (
            <div key={key} className="relative overflow-hidden rounded-3xl border border-white/5 bg-brand-surface p-8 shadow-xl">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-main/5 blur-2xl" />
              <p className="text-xs font-bold uppercase tracking-widest text-brand-text/40">{key.replace('total', 'Total ')}</p>
              <p className="mt-4 text-4xl font-extrabold text-white">{stats[key]}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-brand-text/40 animate-pulse">Loading dashboard statistics...</div>
        )}
      </section>
      {(error || message) && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border ${error ? 'bg-status-error/10 border-status-error/20 text-status-error' : 'bg-status-success/10 border-status-success/20 text-status-success'}`}>
          {error || message}
        </div>
      )}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/5 bg-brand-surface p-6 shadow-soft">
          <h2 className="text-xl font-bold text-white">Add New User</h2>
          <form className="mt-5 space-y-4" onSubmit={handleNewUser}>
            <input className={fieldClass} placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
            <input className={fieldClass} type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
            <input className={fieldClass} placeholder="Address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} required />
            <input className={fieldClass} type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
            <select
              className={fieldClass}
              value={newUser.role}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  role: e.target.value,
                  store_id: e.target.value === 'owner' ? prev.store_id : '',
                }))
              }
            >
              <option value="user" className="bg-brand-surface">Normal User</option>
              <option value="admin" className="bg-brand-surface">Admin</option>
              <option value="owner" className="bg-brand-surface">Store Owner</option>
            </select>
            {newUser.role === 'owner' && (
              <select className={fieldClass} value={newUser.store_id} onChange={(e) => setNewUser({ ...newUser, store_id: e.target.value })} required>
                <option value="" disabled className="bg-brand-surface">
                  Select store for owner
                </option>
                {storeOptions.map((store) => (
                  <option key={store.id} value={store.id} className="bg-brand-surface">
                    {store.name} ({store.email})
                  </option>
                ))}
              </select>
            )}
            <button className={buttonClass}>Create User</button>
          </form>
        </div>
        <div className="rounded-3xl border border-white/5 bg-brand-surface p-6 shadow-soft">
          <h2 className="text-xl font-bold text-white">Add New Store</h2>
          <form className="mt-5 space-y-4" onSubmit={handleNewStore}>
            <input className={fieldClass} placeholder="Store Name" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
            <input className={fieldClass} type="email" placeholder="Store Email" value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} required />
            <textarea className={fieldClass} placeholder="Address" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} rows={3} required />
            <button className={buttonClass}>Create Store</button>
          </form>
        </div>
      </section>
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/5 bg-brand-surface p-8 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Users</h2>
              <p className="text-sm text-brand-text/40 mt-1">Manage and filter user accounts</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-5">
              {['name', 'email', 'address', 'role'].map((key) => (
                <input
                  key={key}
                  className={fieldClass}
                  placeholder={key}
                  value={filters[key]}
                  onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              ))}
              <button type="button" onClick={() => loadUsers(filters, userSort)} className={buttonClass}>Apply Filter</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="min-w-full divide-y divide-white/5 text-left text-sm">
              <thead className="bg-white/[0.02]">
                <tr>
                  <SortHeader label="Name" sortKey="name" sort={userSort} onChange={(next) => { setUserSort(next); loadUsers(filters, next); }} />
                  <SortHeader label="Email" sortKey="email" sort={userSort} onChange={(next) => { setUserSort(next); loadUsers(filters, next); }} />
                  <SortHeader label="Address" sortKey="address" sort={userSort} onChange={(next) => { setUserSort(next); loadUsers(filters, next); }} />
                  <SortHeader label="Role" sortKey="role" sort={userSort} onChange={(next) => { setUserSort(next); loadUsers(filters, next); }} />
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-4 py-4 text-brand-text/80">{user.name}</td>
                    <td className="px-4 py-4 text-brand-text/80">{user.email}</td>
                    <td className="px-4 py-4 text-brand-text/80">{user.address}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-brand-main/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-main">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button type="button" onClick={() => openUserDetails(user.id)} className="btn-sm bg-white/5 text-brand-text hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-brand-surface p-8 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Stores</h2>
              <p className="text-sm text-brand-text/40 mt-1">Monitor store performance and contact details</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              {['name', 'email', 'address'].map((key) => (
                <input
                  key={key}
                  className={fieldClass}
                  placeholder={key}
                  value={storeFilters[key]}
                  onChange={(e) => setStoreFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              ))}
              <button type="button" onClick={() => loadStores(storeFilters, storeSort)} className={buttonClass}>Apply Filter</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="min-w-full divide-y divide-white/5 text-left text-sm">
              <thead className="bg-white/[0.02]">
                <tr>
                  <SortHeader label="Name" sortKey="name" sort={storeSort} onChange={(next) => { setStoreSort(next); loadStores(storeFilters, next); }} />
                  <SortHeader label="Email" sortKey="email" sort={storeSort} onChange={(next) => { setStoreSort(next); loadStores(storeFilters, next); }} />
                  <SortHeader label="Address" sortKey="address" sort={storeSort} onChange={(next) => { setStoreSort(next); loadStores(storeFilters, next); }} />
                  <SortHeader label="Rating" sortKey="rating" sort={storeSort} onChange={(next) => { setStoreSort(next); loadStores(storeFilters, next); }} />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-4 text-brand-text/80 font-medium">{store.name}</td>
                    <td className="px-4 py-4 text-brand-text/80">{store.email}</td>
                    <td className="px-4 py-4 text-brand-text/80">{store.address}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-brand-main font-bold">{store.rating}</span>
                        <span className="text-brand-text/20">/</span>
                        <span className="text-brand-text/40 text-[10px]">5.0</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {(selectedUserLoading || selectedUser || selectedUserError) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl relative rounded-[2.5rem] border border-white/10 bg-brand-surface p-10 shadow-2xl animate-fade-up">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand-main/10 blur-[60px]" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">User Profile</h3>
                  <p className="mt-2 text-brand-text/60">Comprehensive member information</p>
                </div>
                <button type="button" onClick={closeUserDetails} className="btn-sm bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {selectedUserLoading && <div className="py-12 text-center text-brand-text/40 animate-pulse">Fetching user data...</div>}
                {selectedUserError && <div className="rounded-xl bg-status-error/10 border border-status-error/20 px-4 py-3 text-status-error">{selectedUserError}</div>}
                {selectedUser && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { label: 'Full Name', value: selectedUser.name },
                      { label: 'Email Address', value: selectedUser.email },
                      { label: 'Account Role', value: selectedUser.role, highlight: true },
                      { label: 'Address', value: selectedUser.address, full: true },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-2xl bg-white/5 border border-white/5 p-5 ${item.full ? 'md:col-span-2' : ''}`}>
                        <dt className="text-xs font-bold uppercase tracking-widest text-brand-text/30 mb-2">{item.label}</dt>
                        <dd className={`text-base font-semibold ${item.highlight ? 'text-brand-main' : 'text-white'}`}>{item.value}</dd>
                      </div>
                    ))}
                    {selectedUser.role === 'owner' && (
                      <div className="md:col-span-2 rounded-2xl bg-brand-main/5 border border-brand-main/10 p-5">
                        <dt className="text-xs font-bold uppercase tracking-widest text-brand-main/60 mb-2">Associated Store</dt>
                        <dd className="text-base font-bold text-white">
                          {selectedUser.store_name || 'N/A'} 
                          <span className="ml-2 text-brand-main">({selectedUser.store_rating} Avg Rating)</span>
                        </dd>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

