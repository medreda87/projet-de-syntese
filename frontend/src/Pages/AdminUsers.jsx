import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, Trash2, X, Save, ChevronLeft, ChevronRight, User } from 'lucide-react';
import API from '../utils/api';

const ROLES = ['admin', 'provider', 'customer'];

const roleColor = (role) => ({
  admin:    { bg: '#fef2f2', color: '#ef4444' },
  provider: { bg: '#eff6ff', color: '#3b82f6' },
  customer: { bg: '#f0fdf4', color: '#22c55e' },
}[role] || { bg: '#f1f5f9', color: '#64748b' });

/* ── Edit Modal ── */
const EditUserModal = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role, password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      await API.put(`/admin/users/${user.id}`, payload);
      onSaved();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0F172A]">Edit User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
        <div className="space-y-4">
          {[['Full name', 'name', 'text'], ['Email', 'email', 'email']].map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9] focus:ring-2 focus:ring-[#0C8CE9]/10" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9]">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">New password <span className="text-gray-400">(leave blank to keep)</span></label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9] focus:ring-2 focus:ring-[#0C8CE9]/10" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)', opacity: saving ? 0.7 : 1 }}>
            <Save size={15} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Delete Confirm ── */
const ConfirmDelete = ({ label, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-2">Delete user?</h3>
      <p className="text-sm text-[#64748B] mb-6">Are you sure you want to delete <strong>{label}</strong>? This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151]">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Delete</button>
      </div>
    </div>
  </div>
);

const AdminUsers = () => {
  const [users, setUsers]         = useState([]);
  const [meta, setMeta]           = useState({});
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading]     = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users', { params: { search, role: roleFilter, page: p } });
      setUsers(res.data.data);
      setMeta({ total: res.data.total, last_page: res.data.last_page, per_page: res.data.per_page });
    } catch {}
    finally { setLoading(false); }
  }, [search, roleFilter]);

  useEffect(() => { setPage(1); fetchUsers(1); }, [search, roleFilter]);
  useEffect(() => { fetchUsers(page); }, [page]);

  const handleDelete = async () => {
    try { await API.delete(`/admin/users/${deleteUser.id}`); fetchUsers(page); }
    catch (e) { alert(e.response?.data?.message || 'Failed to delete'); }
    finally { setDeleteUser(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0F172A] mb-6">Users</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0C8CE9]" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9]">
          <option value="">All roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-16 text-[#64748B]">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-[#64748B]">No users found.</td></tr>
              ) : users.map(u => {
                const rc = roleColor(u.role);
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#0F172A]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold" style={rc}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setEditUser(u)} className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteUser(u)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-sm text-[#64748B]">Page {page} of {meta.last_page}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
              <button disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={() => { setEditUser(null); fetchUsers(page); }} />}
      {deleteUser && <ConfirmDelete label={deleteUser.name} onConfirm={handleDelete} onClose={() => setDeleteUser(null)} />}
    </div>
  );
};

export default AdminUsers;
