import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { MdOutlineVerified } from "react-icons/md"
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline } from "react-icons/io5"
import { FaTruck, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa"
import { IoArrowBack, IoChevronForward } from "react-icons/io5"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Reviews from '../Components/Reviews'
import { useAuth } from '../contexts/AuthContext'
import API from '../utils/api'

// Fix Leaflet default icon
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

const STORAGE_URL = "http://127.0.0.1:8000/storage/"

const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return STORAGE_URL + path
}

const getDeliveryLabel = (delivery) => {
  if (!delivery) return null
  switch (delivery.type) {
    case 'free':
      return { title: 'Livraison gratuite', detail: 'Livraison gratuite pour toutes les commandes', color: 'green' }
    case 'fixed':
      return { title: 'Livraison à prix fixe', detail: `${delivery.fixed_price} MAD par livraison`, color: 'blue' }
    case 'distance':
      return { title: 'Livraison par distance', detail: `${delivery.price_per_km} MAD/km`, color: 'blue' }
    case 'free_above':
      return { title: 'Livraison gratuite dès', detail: `Gratuite à partir de ${delivery.min_order} MAD`, color: 'green' }
    default:
      return null
  }
}

const SectionTitle = ({ children, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-[#1E2A36] tracking-tight">{children}</h2>
    {subtitle && <p className="text-sm text-[#62707D] mt-1">{subtitle}</p>}
    <div className="w-10 h-0.5 bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] rounded-full mt-3" />
  </div>
)

const ShopDetail = () => {
  const {idLaundry} = useAuth();
  const shopId = parseInt(idLaundry)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const laundry_id = queryParams.get("laundry_id"); 

  const [selectedServices, setSelectedServices] = useState([])
  const [shop, setShop] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')



  useEffect(()=>{
    if (!laundry_id) {
      setLoading(false)
      return
    }

    const fetchShopDetails = async () => {
      try {
        setLoading(true)
        const res = await API.get(`/laundries/${laundry_id}`);
        setShop(res.data.laundry);
        setReviews(res.data.laundry.comments || []);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false)
      }
    }
    fetchShopDetails();
  }, [laundry_id])

  if (loading) {
    return (
      <main>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#0EA5C9] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#62707D] font-medium">Loading shop details...</p>
        </div>
      </main>
    )
  }

  if (!shop) {
    return (
      <main>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-[#1E2A36] mb-2">Shop not found</h1>
          <p className="text-[#62707D] mb-6">The laundry you're looking for doesn't exist or has been removed.</p>
          <Link to="/shops" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0EA5C9] text-white font-medium hover:bg-[#0EA5C9]/90 transition-colors">
            <IoArrowBack /> Back to Shops
          </Link>
        </div>
      </main>
    )
  }

  const handleServiceSelect = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    )
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null

  // Group products by category
  const productsByCategory = (shop.products || []).reduce((acc, product) => {
    const catName = product.category?.name || 'Other'
    const catId = product.category?.id || 0
    if (!acc[catId]) {
      acc[catId] = { id: catId, name: catName, products: [] }
    }
    acc[catId].products.push(product)
    return acc
  }, {})
  const groupedCategories = Object.values(productsByCategory)
  const filteredCategories = selectedCategory === 'all'
    ? groupedCategories
    : groupedCategories.filter(cat => cat.id === selectedCategory)

  return (
    <main className="bg-[#F4F6F8]">
      {/* Hero Section */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img 
          src={getImageUrl(shop.bigLogo) || getImageUrl(shop.logo) || "https://placehold.co/1200x500?text=Laundry"} 
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back Link */}
        <div className="absolute top-4 left-4 md:top-6 md:left-8 z-10">
          <Link 
            to="/shops" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium hover:bg-white/25 transition-all border border-white/20"
          >
            <IoArrowBack className="text-base" /> Back to Shops
          </Link>
        </div>
        
        {/* Hero Content - Bottom overlay bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4 md:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Logo + Name */}
              <div className="flex items-center gap-4 flex-1">
                {shop.logo && (
                  <img 
                    src={getImageUrl(shop.logo)} 
                    alt={shop.name} 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-lg flex-shrink-0" 
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{shop.name}</h1>
                    {shop.email_verified_at && (
                      <span className="bg-[#0EA5C9]/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold text-white">
                        <MdOutlineVerified className="text-sm" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                    {avgRating && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-yellow-400 text-base">★</span>
                        <span className="font-semibold text-white">{avgRating}</span>
                        <span>({reviews.length} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <IoLocationOutline className="text-base" />
                      <span>{shop.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Quick action badges */}
              <div className="flex flex-wrap gap-2">
                {shop.delivery && (
                  <span className="bg-white/15 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium border border-white/20">
                    <FaTruck className="text-xs" /> Delivery
                  </span>
                )}
                {shop.openingHours && (
                  <span className="bg-white/15 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium border border-white/20">
                    <IoTimeOutline className="text-xs" /> {shop.openingHours}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 md:py-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <SectionTitle>About</SectionTitle>
                <p className="text-[#62707D] leading-relaxed text-[15px]">{shop.description}</p>
              </div>

              {/* Delivery Info Section */}
              {shop.delivery && (() => {
                const info = getDeliveryLabel(shop.delivery)
                return info ? (
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <SectionTitle subtitle="Delivery options and pricing">Delivery Information</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`p-5 rounded-xl border ${info.color === 'green' ? 'border-emerald-100 bg-emerald-50/50' : 'border-sky-100 bg-sky-50/50'} transition-all hover:shadow-sm`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${info.color === 'green' ? 'bg-emerald-100' : 'bg-sky-100'}`}>
                            <FaMoneyBillWave className={`text-sm ${info.color === 'green' ? 'text-emerald-600' : 'text-[#0EA5C9]'}`} />
                          </div>
                          <span className={`font-semibold text-sm ${info.color === 'green' ? 'text-emerald-700' : 'text-[#0EA5C9]'}`}>{info.title}</span>
                        </div>
                        <p className={`text-sm ${info.color === 'green' ? 'text-emerald-600' : 'text-sky-600'} pl-12`}>{info.detail}</p>
                      </div>
                      {shop.delivery.delivery_radius && (
                        <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 transition-all hover:shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-sky-100">
                              <FaMapMarkerAlt className="text-sm text-[#0EA5C9]" />
                            </div>
                            <span className="font-semibold text-sm text-[#1E2A36]">Delivery radius</span>
                          </div>
                          <p className="text-sm text-[#62707D] pl-12">{shop.delivery.delivery_radius} km around the shop</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null
              })()}

              {/* Services Section */}
              {shop.services && shop.services.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <SectionTitle subtitle="Select services you need">Our Services</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {shop.services.map((service) => {
                    const isSelected = selectedServices.includes(service.id)
                    
                    return (
                      <label
                        key={service.id}
                        className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                          isSelected 
                            ? "border-[#0EA5C9] bg-sky-50 shadow-sm" 
                            : "border-gray-100 bg-white hover:border-[#0EA5C9]/30 hover:bg-gray-50"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#0EA5C9] rounded-md flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleServiceSelect(service)}
                          className="sr-only"
                        />
                        {service.icon && (
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                            isSelected ? "bg-[#0EA5C9]/15" : "bg-gray-100 group-hover:bg-[#0EA5C9]/10"
                          }`}>
                            <span className="text-xl">{service.icon}</span>
                          </div>
                        )}
                        <span className="font-semibold text-[#1E2A36] text-sm mb-0.5 leading-tight">{service.name}</span>
                        <span className="text-[#0EA5C9] font-bold text-base">{service.price} MAD</span>
                        {service.description && (
                          <span className="text-[11px] text-[#62707D] mt-1">{service.description}</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
              )}

              {/* Products by Category */}
              {groupedCategories.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <SectionTitle subtitle="Browse our product catalogue">Products</SectionTitle>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-[#0EA5C9] text-white shadow-sm'
                        : 'bg-gray-100 text-[#62707D] hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {groupedCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#0EA5C9] text-white shadow-sm'
                          : 'bg-gray-100 text-[#62707D] hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="space-y-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id}>
                      <h3 className="text-sm font-semibold text-[#62707D] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5C9]" />
                        {category.name}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {category.products.map((product) => (
                          <div key={product.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-all group">
                            {product.image ? (
                              <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-48 object-cover" />
                            ) : (
                              <div className="w-full h-48 bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center">
                                <span className="text-4xl">👕</span>
                              </div>
                            )}
                            <div className="p-3">
                              <p className="font-bold text-[#1E2A36] text-base leading-tight">{product.name}</p>
                              <span className="inline-block mt-2 px-4 py-1 rounded-full bg-[#0EA5C9] text-white text-sm font-semibold">
                                {product.price} MAD
                              </span>
                              <p className="text-xs text-[#9CA3AF] mt-2">{shop.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

            <div className="space-y-5 lg:hidden block">
              {/* Book Service Card */}
              <div className="bg-white fixed z-10 bottom-[10px]  rounded-2xl p-6 border border-gray-100 shadow-sm w-[95%] ml-[2.5%] ">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-[#1E2A36]">Book Service</h2>
                  {selectedServices.length > 0 && (
                    <span className="text-xs font-semibold bg-sky-50 text-[#0EA5C9] px-2.5 py-1 rounded-full">
                      {selectedServices.length} selected
                    </span>
                  )}
                </div>
                <Link to="/checkout"
                  state={{form : selectedServices , laundryId: shop.id}}
                  onClick={() => {
                    localStorage.setItem('checkoutServices', JSON.stringify(selectedServices));
                    localStorage.setItem('checkoutLaundryId', JSON.stringify(shop.id));
                  }}
                >
                <button
                  className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedServices.length > 0
                      ? "bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] hover:shadow-lg hover:shadow-sky-200/50 hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={selectedServices.length === 0}
                >
                  {selectedServices.length > 0 
                    ? <>Book {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} <IoChevronForward /></>
                    : "Select Services Above"
                  }
                </button>
                </Link>
              </div>

              {/* Contact Info Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {shop.logo && (
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img 
                        src={getImageUrl(shop.logo)} 
                        alt={shop.name} 
                        className="w-16 h-16 rounded-xl object-cover" 
                      />
                      {shop.email_verified_at && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0EA5C9] rounded-md flex items-center justify-center">
                          <MdOutlineVerified className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <h2 className="text-lg font-bold text-[#1E2A36] mb-4 text-center">Contact Info</h2>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoLocationOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Location</p>
                      <p className="text-[#1E2A36] text-sm font-medium leading-snug">{shop.address}</p>
                    </div>
                  </div>
                  
                  {shop.phone && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoCallOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Phone</p>
                      <a href={`tel:${shop.phone}`} className="text-[#1E2A36] text-sm font-medium hover:text-[#0EA5C9] transition-colors">
                        {shop.phone}
                      </a>
                    </div>
                  </div>
                  )}
                  
                  {shop.email && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoMailOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Email</p>
                      <a href={`mailto:${shop.email}`} className="text-[#1E2A36] text-sm font-medium hover:text-[#0EA5C9] transition-colors truncate block">
                        {shop.email}
                      </a>
                    </div>
                  </div>
                  )}

                  {shop.openingHours && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoTimeOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Opening Hours</p>
                      <p className="text-[#1E2A36] text-sm font-medium">{shop.openingHours}</p>
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Location Map */}
              {shop.latitude && shop.longitude && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-[#1E2A36] mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#0EA5C9]" /> Location
                  </h2>
                  <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: '250px' }}>
                    <MapContainer
                      center={[shop.latitude, shop.longitude]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[shop.latitude, shop.longitude]}>
                        <Popup>{shop.name}<br />{shop.address}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-[#0EA5C9] hover:text-[#0EA5C9]/80 transition-colors"
                  >
                    <FaMapMarkerAlt className="text-xs" /> Open in Google Maps
                  </a>
                </div>
              )}
            </div>
              {/* Customer Reviews Section */}
              <Reviews 
                reviews={reviews}
                title="Customer Reviews"
                showRatingSummary={true}
                laundryId={shop.id}
                variant="default"
              />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5 lg:block hidden">
              {/* Book Service Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 z-10 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-[#1E2A36]">Book Service</h2>
                  {selectedServices.length > 0 && (
                    <span className="text-xs font-semibold bg-sky-50 text-[#0EA5C9] px-2.5 py-1 rounded-full">
                      {selectedServices.length} selected
                    </span>
                  )}
                </div>
                <Link to="/checkout"
                  state={{form : selectedServices , laundryId: shop.id}}
                  onClick={() => {
                    localStorage.setItem('checkoutServices', JSON.stringify(selectedServices));
                    localStorage.setItem('checkoutLaundryId', JSON.stringify(shop.id));
                  }}
                >
                <button
                  className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedServices.length > 0
                      ? "bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] hover:shadow-lg hover:shadow-sky-200/50 hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={selectedServices.length === 0}
                >
                  {selectedServices.length > 0 
                    ? <>Book {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} <IoChevronForward /></>
                    : "Select Services Above"
                  }
                </button>
                </Link>
              </div>

              {/* Contact Info Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {shop.logo && (
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img 
                        src={getImageUrl(shop.logo)} 
                        alt={shop.name} 
                        className="w-16 h-16 rounded-xl object-cover" 
                      />
                      {shop.email_verified_at && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0EA5C9] rounded-md flex items-center justify-center">
                          <MdOutlineVerified className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <h2 className="text-lg font-bold text-[#1E2A36] mb-4 text-center">Contact Info</h2>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoLocationOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Location</p>
                      <p className="text-[#1E2A36] text-sm font-medium leading-snug">{shop.address}</p>
                    </div>
                  </div>
                  
                  {shop.phone && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoCallOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Phone</p>
                      <a href={`tel:${shop.phone}`} className="text-[#1E2A36] text-sm font-medium hover:text-[#0EA5C9] transition-colors">
                        {shop.phone}
                      </a>
                    </div>
                  </div>
                  )}
                  
                  {shop.email && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoMailOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Email</p>
                      <a href={`mailto:${shop.email}`} className="text-[#1E2A36] text-sm font-medium hover:text-[#0EA5C9] transition-colors truncate block">
                        {shop.email}
                      </a>
                    </div>
                  </div>
                  )}

                  {shop.openingHours && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <IoTimeOutline className="text-[#0EA5C9] text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#62707D] mb-0.5">Opening Hours</p>
                      <p className="text-[#1E2A36] text-sm font-medium">{shop.openingHours}</p>
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Location Map */}
              {shop.latitude && shop.longitude && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-[#1E2A36] mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#0EA5C9]" /> Location
                  </h2>
                  <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: '250px' }}>
                    <MapContainer
                      center={[shop.latitude, shop.longitude]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[shop.latitude, shop.longitude]}>
                        <Popup>{shop.name}<br />{shop.address}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-[#0EA5C9] hover:text-[#0EA5C9]/80 transition-colors"
                  >
                    <FaMapMarkerAlt className="text-xs" /> Open in Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ShopDetail
