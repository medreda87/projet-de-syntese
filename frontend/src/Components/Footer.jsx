import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({
  brandName = "FreshFold",
  brandDescription = "Connecting you with the best local laundry services. Fresh clothes, hassle-free. Your trusted laundry marketplace.",
  servicesLinks = [
    "Find Laundry Shops",
    "How It Works",
    "Pickup & Delivery"
  ],
  providersLinks = [
    "Become a Provider",
  ],
  companyLinks = [
    "About Us",
    "Contact",
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy"
  ],
  copyrightYear = "2025",
  attributionText = "Made with ❤️ for clean laundry lovers",
  socialLinks = {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    email: "mailto:info@freshfold.com"
  }
}) => {
  return (
    <footer className="bg-[#1E2A36] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#0EA5C9] rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-xl font-semibold">{brandName}</span>
            </div>
            
            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {brandDescription}
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href={socialLinks.email} className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {servicesLinks.map((link, index) => {
                const servicesLinkMap = {
                  "Find Laundry Shops": "/shops",
                  "How It Works": "/how-it-works",
                  "Pickup & Delivery": "/services"
                }
                const route = servicesLinkMap[link] || "#"
                return (
                  <li key={index}>
                    <Link to={route} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* For Providers Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Providers</h3>
            <ul className="space-y-3">
              {providersLinks.map((link, index) => {
                const providersLinkMap = {
                  "Become a Provider": "/become-provider"
                }
                const route = providersLinkMap[link] || "#"
                return (
                  <li key={index}>
                    <Link to={route} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => {
                const linkMap = {
                  "About Us": "/about",
                  "Contact": "/contact",
                  "Privacy Policy": "/privacy",
                  "Terms of Service": "/terms",
                  "Cookie Policy": "/cookies"
                }
                const route = linkMap[link] || "#"
                return (
                  <li key={index}>
                    <Link to={route} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {copyrightYear} {brandName}. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              {attributionText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer