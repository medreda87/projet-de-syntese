import React, { useState, useEffect } from 'react';
import { Users, Store, MessageSquare } from 'lucide-react';
import API from '../utils/api';

const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '1a' }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-black text-[#0F172A]">{value ?? '—'}</p>
      <p className="text-sm text-[#64748B]">{label}</p>
    </div>
  </div>
);

const AdminHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black text-[#0F172A] mb-6">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <StatCard label="Total Users"    value={stats?.users}     color="#0C8CE9" icon={Users} />
        <StatCard label="Providers"      value={stats?.providers} color="#8b5cf6" icon={Store} />
        <StatCard label="Laundries"      value={stats?.laundries} color="#06D6A0" icon={Store} />
        <StatCard label="Pending Review" value={stats?.pending}   color="#f59e0b" icon={Store} />
        <StatCard label="Accepted"       value={stats?.accepted}  color="#22c55e" icon={Store} />
        <StatCard label="Comments"       value={stats?.comments}  color="#ef4444" icon={MessageSquare} />
      </div>
    </div>
  );
};

export default AdminHome;
