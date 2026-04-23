import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/axiosApi';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Star, Search, RefreshCw, User, ChevronDown, ChevronUp } from 'lucide-react';
import { STORAGE_URL } from '../../utils/config';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Comments = () => {
  const { user } = useAuth();
  const [laundryId, setLaundryId] = useState(() => {
    const laundry = JSON.parse(localStorage.getItem('laundry') || '{}');
    return laundry.id || null;
  });

  // Auto-fetch the laundry from API if it's not in localStorage yet
  useEffect(() => {
    if (laundryId || !user?.id) return;
    API.get(`/laundries/user/${user.id}`)
      .then(res => {
        const list = res.data || [];
        if (list.length > 0) {
          localStorage.setItem('laundry', JSON.stringify(list[0]));
          setLaundryId(list[0].id);
        }
      })
      .catch(() => {});
  }, [laundryId, user?.id]);

  const [comments, setComments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!laundryId) return;
    setLoading(true);
    try {
      const res = await API.get(`/comments/laundry/${laundryId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [laundryId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  useEffect(() => {
    let result = [...comments];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.comment?.toLowerCase().includes(term) ||
        c.name?.toLowerCase().includes(term) ||
        c.user?.name?.toLowerCase().includes(term)
      );
    }
    if (ratingFilter !== 'all') {
      result = result.filter(c => c.rating === parseInt(ratingFilter));
    }
    setFiltered(result);
  }, [comments, searchTerm, ratingFilter]);

  const avgRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length).toFixed(1)
    : null;

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: comments.filter(c => c.rating === r).length,
  }));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>Customer Reviews</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{comments.length} total review{comments.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={fetchComments}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats row */}
      {comments.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', paddingRight: 20, borderRight: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 42, fontWeight: 800, color: '#0C8CE9', margin: 0, lineHeight: 1 }}>{avgRating}</p>
            <StarRating rating={Math.round(parseFloat(avgRating))} />
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>out of 5</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 8 }}>
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b', width: 16, textAlign: 'right' }}>{rating}</span>
                <svg className={`w-3 h-3`} style={{ width: 12, height: 12, color: '#facc15', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #facc15, #f59e0b)', width: comments.length ? `${(count / comments.length) * 100}%` : '0%', transition: 'width 0.4s' }} />
                </div>
                <span style={{ fontSize: 12, color: '#64748b', width: 20 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px' }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1e293b', width: '100%', background: 'transparent' }}
          />
        </div>
        <select
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#1e293b', cursor: 'pointer', outline: 'none' }}
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
        </select>
      </div>

      {/* Comments list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTop: '3px solid #0C8CE9', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <MessageSquare size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>
            {comments.length === 0 ? 'No reviews yet for your laundry' : 'No reviews match your search'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((comment) => {
            const isExpanded = expandedId === comment.id;
            const authorName = comment.name || comment.user?.name || 'Anonymous';
            const initial = authorName.charAt(0).toUpperCase();

            return (
              <div
                key={comment.id}
                style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
              >
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {/* Avatar */}
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{initial}</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                        <div>
                          <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 14, margin: 0 }}>{authorName}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>{formatDate(comment.created_at)}</p>
                        </div>
                        {comment.rating > 0 && <StarRating rating={comment.rating} />}
                      </div>

                      <p style={{ fontSize: 13, color: '#475569', marginTop: 8, lineHeight: 1.6, margin: '8px 0 0' }}>
                        {comment.comment}
                      </p>

                      {comment.image && (
                        <img
                          src={`${STORAGE_URL}${comment.image}`}
                          alt="review"
                          style={{ marginTop: 10, maxHeight: 160, borderRadius: 8, objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Replies toggle */}
                  {comment.replies && comment.replies.length > 0 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : comment.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, marginLeft: 50, fontSize: 12, color: '#0C8CE9', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                    </button>
                  )}
                </div>

                {/* Replies */}
                {isExpanded && comment.replies?.map((reply) => (
                  <div key={reply.id} style={{ borderTop: '1px solid #f1f5f9', padding: '12px 20px 12px 70px', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={14} color="#64748b" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 13, margin: 0 }}>{reply.user?.name || 'User'}</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 4px' }}>{formatDate(reply.created_at)}</p>
                        <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>{reply.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comments;
