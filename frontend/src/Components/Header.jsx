import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import BrandLogo from './BrandLogo'

function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [avatarOpen, setAvatarOpen] = useState(false)
    const avatarRef = useRef(null)
    const { isAuthenticated, logout , user } = useAuth()

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
        setIsMenuOpen(false)
        setShowLogoutModal(false)
    }

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/shops", label: "Find Shops" },
        { href: "/services", label: "Services" },
        { href: "/how-it-works", label: "How It Works" },
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
    ]

    return (
        <>
            <div className='header'>
                <div className='header-left'>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        <BrandLogo imgClassName="logo" nameTag="h1" nameClassName="site-title" />
                    </Link>
                </div>
                
                {/* Desktop Navigation */}
                <nav className='header-nav flex justify-center desktop-nav'>
                    <ul className='nav-list'>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    to={link.href} 
                                    className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        {user?.role === 'admin' && (
                            <li key="/superadmin">
                                <Link
                                    to="/superadmin"
                                    className={`nav-link ${location.pathname.startsWith('/superadmin') ? 'active' : ''}`}
                                >
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}
                        {user && user.role === 'provider' && (
                            <li key="/dashboard">
                                <Link
                                    to="/dashboard"
                                    className="nav-link"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        )}
                        {isAuthenticated && user?.role !== 'provider' && user?.role !== 'admin' && (
                            <li key="/my-orders">
                                <Link
                                    to="/my-orders"
                                    className={`nav-link ${location.pathname === '/my-orders' ? 'active' : ''}`}
                                >
                                    My Orders
                                </Link>
                            </li>
                        )}
                        { user?.role !== 'provider' && user?.role !== 'admin' && (
                            <li key="/become-provider">
                                <Link 
                                    to="/become-provider" 
                                    className={`nav-link ${location.pathname === "/become-provider" ? 'active' : ''}`}
                                >
                                    Become a Provider
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                {/* Desktop right side: avatar dropdown or sign in/up */}
                <div className="header-buttons desktop-buttons">
                    {isAuthenticated ? (
                        <div className="header-avatar-wrap" ref={avatarRef}>
                            <button
                                className="header-avatar-btn"
                                onClick={() => setAvatarOpen(v => !v)}
                                aria-label="Account menu"
                            >
                                <div className="header-avatar-circle">
                                    {user?.name?.[0]?.toUpperCase() || <FaUser size={14} />}
                                </div>
                                <span className="header-avatar-name">{user?.name?.split(' ')[0]}</span>
                                <svg className={`header-avatar-chevron ${avatarOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {avatarOpen && (
                                <div className="header-avatar-dropdown">
                                    <Link
                                        to="/profile"
                                        className="header-avatar-item"
                                        onClick={() => setAvatarOpen(false)}
                                    >
                                        <FaUser size={13} /> Profile
                                    </Link>
                                    <div className="header-avatar-divider" />
                                    <button
                                        className="header-avatar-item header-avatar-item--danger"
                                        onClick={() => { setAvatarOpen(false); setShowLogoutModal(true); }}
                                    >
                                        <FaSignOutAlt size={13} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className="btn btn-outline" onClick={() => navigate('/login')}>
                                Sign In
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div 
                    className="mobile-menu-overlay"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <ul className="mobile-nav-list">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    to={link.href}
                                    className={`mobile-nav-link ${location.pathname === link.href ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        {user?.role === 'admin' && (
                            <li key="/superadmin-mobile">
                                <Link
                                    to="/superadmin"
                                    className={`mobile-nav-link ${location.pathname.startsWith('/superadmin') ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}
                        {user && user.role === 'provider' && (
                            <li key="/dashboard-mobile">
                                <Link
                                    to="/dashboard"
                                    className="mobile-nav-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            </li>
                        )}
                        {isAuthenticated && user?.role !== 'provider' && user?.role !== 'admin' && (
                            <li key="/my-orders-mobile">
                                <Link
                                    to="/my-orders"
                                    className={`mobile-nav-link ${location.pathname === '/my-orders' ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Orders
                                </Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li key="/profile-mobile">
                                <Link
                                    to="/profile"
                                    className={`mobile-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                            </li>
                        )}
                    </ul>
                    <div className="mobile-buttons">
                        {isAuthenticated ? (
                            <button 
                                className="btn btn-outline mobile-btn" 
                                onClick={() => setShowLogoutModal(true)}
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <button 
                                    className="btn btn-outline mobile-btn" 
                                    onClick={() => {
                                        navigate('/login')
                                        setIsMenuOpen(false)
                                    }}
                                >
                                    Sign In
                                </button>
                                <button 
                                    className="btn btn-primary mobile-btn" 
                                    onClick={() => {
                                        navigate('/signup')
                                        setIsMenuOpen(false)
                                    }}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {/* Logout confirmation modal */}
            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setShowLogoutModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">Log out?</h3>
                        <p className="text-sm text-[#64748B] mb-6">Are you sure you want to log out of your account?</p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#0F172A] hover:bg-gray-50 transition-colors"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header