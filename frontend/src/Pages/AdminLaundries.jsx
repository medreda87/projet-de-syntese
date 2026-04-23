import React, { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight, MapPin, User, Phone, Mail, Clock, Globe, Eye, X, Calendar } from 'lucide-react';
import API from '../utils/api';
import { STORAGE_URL } from '../utils/config';

/* ── Detail Modal ── */
const DetailModal = ({ laundry: l, onClose }) => {
  if (!l) return null;
  const st = l.is_accepted
    ? { bg: '#f0fdf4', color: '#22c55e', label: 'Accepted' }
    : { bg: '#fffbeb', color: '#f59e0b', label: 'Pending' };

  const InfoRow = ({ icon: Icon, label, value }) =>
    value ? (
      <div className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
        <div className="w-5 flex-shrink-0 mt-0.5"><Icon size={15} className="text-[#0C8CE9]" /></div>
        <div>
          <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-wide mb-0.5">{label}</p>
          <p className="text-sm text-[#0F172A]">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Image header */}
        <div className="relative h-48 bg-gradient-to-br from-[#0C8CE9]/10 to-[#06D6A0]/10 flex items-center justify-center overflow-hidden rounded-t-2xl">
          {l.logo || l.image ? (
            <img src={`${STORAGE_URL}${l.logo || l.image}`} alt={l.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">🧺</span>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow text-gray-500 hover:text-gray-800">
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold shadow" style={{ background: st.bg, color: st.color }}>{st.label}</span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-black text-[#0F172A] mb-1">{l.name}</h2>
          {l.description && <p className="text-sm text-[#64748B] mb-5 leading-relaxed">{l.description}</p>}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Laundry info */}
            <div>
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">Laundry Info</h3>
              <div className="bg-gray-50 rounded-xl px-4">
                <InfoRow icon={MapPin}  label="Address"       value={l.address} />
                <InfoRow icon={Globe}   label="City"          value={l.city} />
                <InfoRow icon={Phone}   label="Phone"         value={l.phone} />
                <InfoRow icon={Mail}    label="Email"         value={l.email} />
                <InfoRow icon={Clock}   label="Opening Hours" value={l.openingHours} />
                <InfoRow icon={MapPin}  label="Coordinates"   value={l.latitude && l.longitude ? `${l.latitude}, ${l.longitude}` : null} />
                <InfoRow icon={Calendar}label="Registered"    value={new Date(l.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              </div>
            </div>

            {/* Provider info */}
            <div>
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">Provider</h3>
              {l.user ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)' }}>
                      {l.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">{l.user.name}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-xs font-semibold capitalize"
                        style={{ background: '#eff6ff', color: '#3b82f6' }}>{l.user.role}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#64748B]"><Mail size={13} />{l.user.email}</div>
                    {l.user.phone && <div className="flex items-center gap-2 text-[#64748B]"><Phone size={13} />{l.user.phone}</div>}
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <Calendar size={13} />Joined {new Date(l.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ) : <p className="text-sm text-[#94a3b8]">No provider linked.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusStyle = (accepted) =>
  accepted ? { bg: '#f0fdf4', color: '#22c55e', label: 'Accepted' }
           : { bg: '#fffbeb', color: '#f59e0b', label: 'Pending' };

const ConfirmModal = ({ title, message, confirmLabel, confirmClass, icon: Icon, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
      {Icon && (
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmClass === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
          <Icon size={24} className={confirmClass === 'danger' ? 'text-red-500' : 'text-amber-500'} />
        </div>
      )}
      <h3 className="text-lg font-bold text-[#0F172A] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151]">Cancel</button>
        <button onClick={onConfirm}
          className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold ${confirmClass === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const AdminLaundries = () => {
  const [laundries, setLaundries] = useState([]);
  const [meta, setMeta]           = useState({});
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [loading, setLoading]     = useState(false);
  const [confirm, setConfirm]     = useState(null);
  const [feedback, setFeedback]   = useState(null);
  const [detail, setDetail]       = useState(null);

  const fetchLaundries = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await API.get('/admin/laundries', { params: { search, status: statusFilter, page: p } });
      setLaundries(res.data.data);
      setMeta({ total: res.data.total, last_page: res.data.last_page });
    } catch {}
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { setPage(1); fetchLaundries(1); }, [search, statusFilter]);
  useEffect(() => { fetchLaundries(page); }, [page]);

  const flash = (msg, ok = true) => { setFeedback({ msg, ok }); setTimeout(() => setFeedback(null), 3500); };

  const handleConfirm = async () => {
    const { type, item } = confirm;
    setConfirm(null);
    try {
      if (type === 'approve') { await API.post(`/admin/laundries/${item.id}/approve`); flash('Laundry approved — provider notified by email.'); }
      else if (type === 'reject') { await API.post(`/admin/laundries/${item.id}/reject`); flash('Laundry rejected.'); }
      else if (type === 'delete') { await API.delete(`/admin/laundries/${item.id}`); flash('Laundry deleted.'); }
      fetchLaundries(page);
    } catch (e) { flash(e.response?.data?.message || 'Something went wrong.', false); }
  };

  const TABS = ['', 'pending', 'accepted'];

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0F172A] mb-6">Laundries</h1>

      {/* Feedback banner */}
      {feedback && (
        <div className={`mb-5 px-5 py-3 rounded-xl text-sm font-medium ${feedback.ok ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {feedback.msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or address…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0C8CE9]" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[['All', ''], ['Pending', 'pending'], ['Accepted', 'accepted']].map(([label, val]) => (
            <button key={val} onClick={() => setStatus(val)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter === val ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="text-center py-16 text-[#64748B]">Loading…</div>
      ) : laundries.length === 0 ? (
        <div className="text-center py-16 text-[#64748B]">No laundries found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {laundries.map(l => {
            const st = statusStyle(l.is_accepted);
            return (
              <div key={l.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {/* Image / placeholder */}
                <div className="h-36 bg-gradient-to-br from-[#0C8CE9]/10 to-[#06D6A0]/10 flex items-center justify-center overflow-hidden">
                  {l.image ? (
                    <img src={`${STORAGE_URL}${l.image}`} alt={l.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🧺</span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-[#0F172A] leading-tight">{l.name}</h3>
                    <span className="mt-0.5 flex-shrink-0 inline-block px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                  {l.address && <p className="text-xs text-[#64748B] flex items-center gap-1 mb-1"><MapPin size={12} />{l.address}</p>}
                  {l.user && <p className="text-xs text-[#64748B] flex items-center gap-1"><User size={12} />{l.user.name} — {l.user.email}</p>}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setDetail(l)}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[#0C8CE9]/10 text-[#0C8CE9] text-xs font-semibold hover:bg-[#0C8CE9]/20 transition-colors">
                      <Eye size={13} /> Details
                    </button>
                    {!l.is_accepted && (
                      <button onClick={() => setConfirm({ type: 'approve', item: l })}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 transition-colors">
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                    {l.is_accepted && (
                      <button onClick={() => setConfirm({ type: 'reject', item: l })}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-amber-50 text-amber-600 text-xs font-semibold hover:bg-amber-100 transition-colors">
                        <XCircle size={14} /> Revoke
                      </button>
                    )}
                    <button onClick={() => setConfirm({ type: 'delete', item: l })}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
          <span className="text-sm text-[#64748B]">Page {page} of {meta.last_page}</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title={
            confirm.type === 'approve' ? 'Approve this laundry?' :
            confirm.type === 'reject'  ? 'Revoke acceptance?' :
            'Delete this laundry?'
          }
          message={
            confirm.type === 'approve' ? `Approve "${confirm.item.name}"? The provider will receive an email notification.` :
            confirm.type === 'reject'  ? `Revoke acceptance of "${confirm.item.name}"?` :
            `Permanently delete "${confirm.item.name}"? This cannot be undone.`
          }
          confirmLabel={confirm.type === 'approve' ? 'Approve' : confirm.type === 'reject' ? 'Revoke' : 'Delete'}
          confirmClass={confirm.type === 'delete' ? 'danger' : 'warning'}
          icon={confirm.type === 'delete' ? Trash2 : confirm.type === 'approve' ? CheckCircle : XCircle}
          onConfirm={handleConfirm}
          onClose={() => setConfirm(null)}
        />
      )}
      {detail && <DetailModal laundry={detail} onClose={() => setDetail(null)} />}
    </div>
  );
};

export default AdminLaundries;
