import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineVerified } from "react-icons/md"
import { IoLocationOutline, IoCallOutline, IoMailOutline } from "react-icons/io5"
import { FaTruck } from "react-icons/fa"
import { IoArrowBack } from "react-icons/io5"
import Reviews from '../Components/Reviews'
import { useAuth } from '../contexts/AuthContext'
import API from '../utils/api'




const ShopDetail = () => {
  const {idLaundry} = useAuth();
  const shopId = parseInt(idLaundry)

  const [selectedServices, setSelectedServices] = useState([])
  const [shop, setShop] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchShopDetails = async () => {
      try {
        setLoading(true)
        const res = await API.get(`/laundries/${shopId}`);
        console.log("Fetched shop details:", res.data);
        setShop(res.data);
        setReviews(res.data.comment || []);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false)
      }
    }
    fetchShopDetails();
  }, [shopId])

  if (loading) {
    return (
      <main>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-[#62707D]">Loading...</p>
        </div>
      </main>
    )
  }

  if (!shop) {
    return (
      <main >
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Shop not found</h1>
          <Link to="/shops" className="text-[#0EA5C9] hover:underline">
            ← Back to Shops
          </Link>
        </div>
      </main>
    )
  }

  const handleServiceSelect = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    )
  }

  return (
    <main >
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img 
          src={shop.bigLogo || shop.logo} 
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8 text-white">
            <Link 
              to="/shops" 
              className="inline-flex items-center gap-2 mb-4 text-white hover:text-gray-200 transition-colors"
            >
              <IoArrowBack /> Back to Shops
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{shop.name}</h1>
              {shop.email_verified_at && (
                <span className="bg-[#0EA5C9] px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  <MdOutlineVerified /> Verified
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
                    : "N/A"
                  }
                </span>
                <span className="text-gray-300">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <IoLocationOutline />
                <span>{shop.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#F7F9FA] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1E2A36] mb-4">About</h2>
                <p className="text-[#62707D] leading-relaxed mb-4">{shop.description}</p>
                
                {shop.delivery && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-[#E0F2FE] text-[#0EA5C9] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                      <FaTruck /> Delivery Available
                    </span>
                  </div>
                )}
              </div>

              {/* Services Section */}
              {shop.services && shop.services.length > 0 && (
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1E2A36] mb-6">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shop.services.map((service) => {
                    const isSelected = selectedServices.includes(service.id)
                    
                    return (
                      <label
                        key={service.id}
                        className={`relative flex flex-col items-center text-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                          isSelected 
                            ? "border-[#0EA5C9] bg-[#E0F2FE] shadow-md shadow-sky-100" 
                            : "border-gray-100 bg-[#F8FAFC] hover:border-[#0EA5C9]/40 hover:shadow-md"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-5 h-5 bg-[#0EA5C9] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleServiceSelect(service.id)}
                          className="sr-only"
                        />
                        {service.icon && (
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
                            isSelected ? "bg-[#0EA5C9]/20" : "bg-[#E0F2FE] group-hover:bg-[#0EA5C9]/10"
                          }`}>
                            <img src={service.icon} alt={service.name} className="w-7 h-7 object-contain" />
                          </div>
                        )}
                        <span className="font-semibold text-[#1E2A36] text-base mb-1">{service.name}</span>
                        <span className="text-[#0EA5C9] font-bold text-lg mb-2">{service.price}</span>
                        {service.description && (
                          <span className="text-xs text-[#62707D] bg-white/60 px-3 py-1 rounded-full">{service.description}</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
              )}

              {/* Products by Category */}
              {shop.categories && shop.categories.length > 0 && (
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1E2A36] mb-6">Products</h2>
                {shop.categories.map((category) => (
                  <div key={category.id} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-semibold text-[#1E2A36] mb-3">{category.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.products && category.products.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-[#F8FAFC]">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-[#1E2A36]">{product.name}</p>
                            {product.description && <p className="text-xs text-[#62707D]">{product.description}</p>}
                            <p className="text-[#0EA5C9] font-bold mt-1">{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              )}

              {/* Customer Reviews Section */}
              <Reviews 
                reviews={reviews}
                title="Customer Reviews"
                showRatingSummary={true}
                shopId={shopId}
                variant="default"
              />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Book Service Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-[#1E2A36] mb-4">Book Service</h2>
                <Link to="/checkout">
                <button
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                    selectedServices.length > 0
                      ? "bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] hover:from-[#0EA5C9]/90 hover:to-[#1BB38C]/90"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={selectedServices.length === 0}
                >
                 
                  {selectedServices.length > 0 
                    ? `Book ${selectedServices.length} Service${selectedServices.length > 1 ? 's' : ''}`
                    : "Select Services Above"
                  }
                </button>
                </Link>

              </div>

              {/* Contact Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1E2A36] mb-4">Contact Info</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <IoLocationOutline className="text-[#0EA5C9] text-xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#62707D]">Location</p>
                      <p className="text-[#1E2A36] font-medium">{shop.address}</p>
                    </div>
                  </div>
                  
                  {shop.phone && (
                  <div className="flex items-start gap-3">
                    <IoCallOutline className="text-[#0EA5C9] text-xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#62707D]">Phone</p>
                      <a href={`tel:${shop.phone}`} className="text-[#1E2A36] font-medium hover:text-[#0EA5C9]">
                        {shop.phone}
                      </a>
                    </div>
                  </div>
                  )}
                  
                  {shop.email && (
                  <div className="flex items-start gap-3">
                    <IoMailOutline className="text-[#0EA5C9] text-xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#62707D]">Email</p>
                      <a href={`mailto:${shop.email}`} className="text-[#1E2A36] font-medium hover:text-[#0EA5C9]">
                        {shop.email}
                      </a>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ShopDetail
