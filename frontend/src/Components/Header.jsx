import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

const logo = '/images/imageLogo.png'

function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isAuthenticated, logout } = useAuth()

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
        { href: "/how-it-works", label: "How It Works" },
        { href: "/about", label: "About Us" },
        { href: "/become-provider", label: "Become a Provider" }
    ]

    return (
        <>
            <div className='header'>
                <div className='header-left'>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        <img src={logo} alt="FreshFold Logo" className='logo' />
                        <h1 className='site-title'>FreshFold</h1>
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
                    </ul>
                </nav>

                {/* Desktop Buttons */}
                <div className="header-buttons desktop-buttons">
                    {isAuthenticated ? (
                        <button className="btn btn-outline" onClick={() => { logout(); navigate('/'); }}>
                            Logout
                        </button>
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
                    </ul>
                    <div className="mobile-buttons">
                        {isAuthenticated ? (
                            <button 
                                className="btn btn-outline mobile-btn" 
                                onClick={() => {
                                    logout()
                                    navigate('/')
                                    setIsMenuOpen(false)
                                }}
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
        </>
    )
}

export default Header