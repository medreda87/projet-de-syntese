import React from 'react'
import { Link } from 'react-router-dom'
import Component14 from '../Components/Component14'
import Component20 from '../Components/Component20'
import { useAuth } from '../contexts/AuthContext'
import {
  FaTshirt,
  FaSprayCan,
  FaSnowflake,
  FaFolderOpen,
  FaTruck,
  FaBolt,
} from 'react-icons/fa'

const SERVICES = [
  {
    icon: FaTshirt,
    title: 'Wash & Fold',
    description: 'Standard washing, drying, and folding of your everyday clothes. Sorted by color and fabric type.',
    color: '#0C8CE9',
    bg: '#eff6ff',
  },
  {
    icon: FaSprayCan,
    title: 'Dry Cleaning',
    description: "Professional dry cleaning for delicate fabrics, suits, dresses, and items that can't be machine washed.",
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    icon: FaSnowflake,
    title: 'Ironing & Pressing',
    description: 'Crisp, wrinkle-free results for shirts, trousers, and formal wear. Done by experienced professionals.',
    color: '#06D6A0',
    bg: '#f0fdf4',
  },
  {
    icon: FaFolderOpen,
    title: 'Wash & Iron',
    description: 'A complete all-in-one service: your laundry is washed, dried, ironed, and returned ready to wear.',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    icon: FaTruck,
    title: 'Pickup & Delivery',
    description: 'Schedule a convenient pickup window and we deliver your clean clothes straight to your door.',
    color: '#ef4444',
    bg: '#fef2f2',
  },
  {
    icon: FaBolt,
    title: 'Express Service',
    description: 'Need it back fast? Our express service guarantees same-day or next-day turnaround for urgent items.',
    color: '#f97316',
    bg: '#fff7ed',
  },
]

const Services = () => {
  const { user } = useAuth()

  return (
    <main>
      <Component14
        buttonText="Find a Shop"
        titlePart1="Our <span>Laundry Services</span>"
        description="From everyday wash & fold to delicate dry cleaning — Mesbanati providers offer a full range of professional services. Compare, book, and enjoy clean clothes without the hassle."
      />

      {/* Services grid */}
      <section className="py-16 px-4 bg-[#F7F9FA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-3">
              What We <span className="text-[#0C8CE9]">Offer</span>
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              Every service is provided by verified local laundry shops. Browse shops near you and choose the services that fit your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => {
              const Icon = svc.icon
              return (
                <div
                  key={svc.title}
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: svc.bg }}
                  >
                    <Icon size={24} style={{ color: svc.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{svc.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{svc.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works teaser */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
            Simple process, <span className="text-[#0C8CE9]">great results</span>
          </h2>
          <p className="text-[#64748B] mb-8">
            Browse shops, select your services, schedule a pickup — your laundry is handled by trained professionals and returned clean to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shops"
              className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)' }}
            >
              Browse Shops
            </Link>
            <Link
              to="/how-it-works"
              className="px-8 py-3 rounded-xl border border-gray-200 text-[#0F172A] font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {user?.role !== 'provider' && <Component20 />}
    </main>
  )
}

export default Services
