import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../utils/api';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={12} fill={i <= rating ? '#f59e0b' : 'none'} stroke={i <= rating ? '#f59e0b' : '#cbd5e1'} />
    ))}
  </div>
);

const ConfirmDelete = ({ comment, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-2">Delete comment?</h3>
      <p className="text-sm text-[#64748B] mb-6">This will permanently remove this comment. Action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151]">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Delete</button>
      </div>
    </div>
  </div>
);

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [meta, setMeta]       = useState({});
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchComments = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await API.get('/admin/comments', { params: { search, page: p } });
      setComments(res.data.data);
      setMeta({ total: res.data.total, last_page: res.data.last_page });
    } catch {}
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { setPage(1); fetchComments(1); }, [search]);
  useEffect(() => { fetchComments(page); }, [page]);

  const handleDelete = async () => {
    try { await API.delete(`/admin/comments/${toDelete.id}`); fetchComments(page); }
    catch {}
    finally { setToDelete(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0F172A] mb-6">Comments</h1>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search comments…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0C8CE9]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['User', 'Laundry', 'Comment', 'Rating', 'Date', ''].map((h, i) => (
                <th key={i} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-16 text-[#64748B]">Loading…</td></tr>
              ) : comments.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-[#64748B]">No comments found.</td></tr>
              ) : comments.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)' }}>
                        {(c.user?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[#0F172A] whitespace-nowrap">{c.user?.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#64748B] whitespace-nowrap">{c.laundry?.name || '—'}</td>
                  <td className="px-5 py-4 text-[#374151] max-w-xs">
                    <p className="line-clamp-2">{c.body || c.content || c.comment || '—'}</p>
                  </td>
                  <td className="px-5 py-4">
                    {c.rating != null ? <StarRating rating={c.rating} /> : <span className="text-[#64748B]">—</span>}
                  </td>
                  <td className="px-5 py-4 text-[#64748B] whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setToDelete(c)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
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

      {toDelete && <ConfirmDelete comment={toDelete} onConfirm={handleDelete} onClose={() => setToDelete(null)} />}
    </div>
  );
};

export default AdminComments;
