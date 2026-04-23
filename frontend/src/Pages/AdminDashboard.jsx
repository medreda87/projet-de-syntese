import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Users, Store, MessageSquare,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import BrandLogo from '../Components/BrandLogo';

/* ── Admin Layout (shell) ── */
const navItems = [
  { to: '/superadmin',           end: true, icon: LayoutDashboard, label: 'Overview' },
  { to: '/superadmin/users',     end: true, icon: Users,           label: 'Users' },
  { to: '/superadmin/laundries', end: true, icon: Store,           label: 'Laundries' },
  { to: '/superadmin/comments',  end: true, icon: MessageSquare,   label: 'Comments' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/', { replace: true });
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6F8]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo
              imgClassName="h-[60px] w-[130px] object-cover rounded-xl"
              nameClassName="text-xl font-black"
              nameStyle={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            />
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)' }}>
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A] leading-none">{user?.name}</p>
              <p className="text-xs text-[#64748B] mt-0.5 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0C8CE9]/10 text-[#0C8CE9]'
                    : 'text-[#64748B] hover:bg-gray-50 hover:text-[#0F172A]'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-[#64748B]" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-[#64748B]">
            <span>Admin</span><ChevronRight size={14} /><span className="text-[#0F172A] font-medium">Dashboard</span>
          </div>
          <div className="text-sm font-medium text-[#64748B]">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
