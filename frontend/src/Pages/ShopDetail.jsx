import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MdOutlineVerified } from "react-icons/md"
import { IoLocationOutline, IoCallOutline, IoMailOutline } from "react-icons/io5"
import { FaTruck, FaClock } from "react-icons/fa"
import { IoArrowBack } from "react-icons/io5"
import Reviews from '../Components/Reviews'
import { useAuth } from '../contexts/AuthContext'

// Sample reviews data for each shop
const getShopReviews = (shopId) => {
  const reviewsData = {
    1: [
      {
        customerName: "Jennifer Smith",
        rating: 5,
        comment: "Excellent service! My clothes came back perfectly cleaned and folded. The staff is professional and the turnaround time was exactly as promised.",
        date: "2024-02-15",
        service: "Wash & Fold"
      },
      {
        customerName: "Mark Davis",
        rating: 5,
        comment: "Best laundry service in the area. I've been using Sparkle Clean for months and they never disappoint. Highly recommend!",
        date: "2024-02-10",
        service: "Dry Cleaning"
      },
      {
        customerName: "Lisa Anderson",
        rating: 4.5,
        comment: "Great quality and fast service. The eco-friendly detergents are a nice touch. Will definitely use again.",
        date: "2024-02-05",
        service: "Wash & Fold"
      },
      {
        customerName: "James Wilson",
        rating: 5,
        comment: "Professional service with attention to detail. My suits always come back looking brand new. Worth every penny!",
        date: "2024-01-28",
        service: "Dry Cleaning"
      },
      {
        customerName: "Maria Garcia",
        rating: 4.5,
        comment: "Very satisfied with the service. The staff is friendly and the prices are reasonable. Quick delivery too!",
        date: "2024-01-20",
        service: "Ironing"
      }
    ],
    2: [
      {
        customerName: "Robert Brown",
        rating: 5,
        comment: "Family-owned business with personal touch. They really care about their customers. My bedding came back fresh and clean!",
        date: "2024-02-12",
        service: "Bedding & Linens"
      },
      {
        customerName: "Patricia Taylor",
        rating: 5,
        comment: "Excellent service! Been coming here for years. The quality is consistent and the staff remembers my preferences.",
        date: "2024-02-08",
        service: "Full Service Wash"
      },
      {
        customerName: "Christopher Lee",
        rating: 4.5,
        comment: "Great laundry service. The prices are fair and the work is always done well. Highly recommend!",
        date: "2024-02-01",
        service: "Dry Cleaning"
      }
    ],
    3: [
      {
        customerName: "Amanda White",
        rating: 5,
        comment: "Love that they use eco-friendly products! My clothes are clean and I feel good about the environmental impact. Great service!",
        date: "2024-02-14",
        service: "Eco Wash"
      },
      {
        customerName: "Daniel Martinez",
        rating: 4.5,
        comment: "Good quality organic dry cleaning. A bit pricier but worth it for the eco-friendly approach. Professional service.",
        date: "2024-02-07",
        service: "Organic Dry Clean"
      },
      {
        customerName: "Rachel Green",
        rating: 5,
        comment: "Perfect! My clothes are always clean and fresh. The organic products are gentle on fabrics. Highly recommend EcoWash!",
        date: "2024-01-30",
        service: "Eco Wash"
      }
    ]
  };
  
  return reviewsData[shopId] || [];
};

const getShopDetails = (id) => {
  const shopDetails = {
    1: {
      fullAddress: "Downtown, 123 Main Street",
      hours: "Mon-Sat: 7AM-8PM, Sun: 9AM-5PM",
      phone: "+1 234 567 890",
      email: "info@sparkleclean.com",
      features: ["Free Delivery", "Quick Service"],
      services: [
        { name: "Wash & Fold", time: "24 hours", price: "2.00dh/kg" },
        { name: "Dry Cleaning", time: "48 hours", price: "7.00dh/item" },
        { name: "Ironing", time: "24 hours", price: "15dh/item" }
      ]
    },
    2: {
      fullAddress: "Old Town, 78 Heritage Lane",
      hours: "Mon-Sat: 7AM-8PM, Sun: 9AM-5PM",
      phone: "+1 234 567 894",
      email: "hello@laundrybasket.com",
      features: ["Free Delivery", "Quick Service"],
      services: [
        { name: "Full Service Wash", time: "24 hours", price: "$2.25/lb" },
        { name: "Dry Cleaning", time: "48 hours", price: "$7.00/item" },
        { name: "Bedding & Linens", time: "24 hours", price: "$15.00/set" }
      ]
    },
    3: {
      fullAddress: "Green District, 45 Eco Street",
      hours: "Mon-Fri: 8AM-7PM, Sat: 9AM-6PM, Sun: Closed",
      phone: "+1 234 567 891",
      email: "contact@ecowash.com",
      features: ["Eco-Friendly", "Organic Products"],
      services: [
        { name: "Eco Wash", time: "24 hours", price: "$2.50/lb" },
        { name: "Organic Dry Clean", time: "48 hours", price: "$8.00/item" }
      ]
    }
  }
  return shopDetails[id] || {
    fullAddress: "Contact for address",
    hours: "Mon-Sat: 7AM-8PM",
    phone: "+1 234 567 890",
    email: "contact@freshfold.com",
    features: [],
    services: []
  }
}

const baseLaundries = [
  {
    id: 1, verified: true, reviews: "135", title: "Sparkle Clean Laundry",
    description: "Premium laundry services with eco-friendly detergents. We take care of your clothes like they're our own.",
    rating: 4.9, services: ["Wash & Fold", "Dry Cleaning", "Ironing"],
    status: "Open Now", image: "/images/image1.png", location: "0.5 km", time: "24 hours"
  },
  {
    id: 2, verified: true, reviews: "320", title: "The Laundry Basket",
    description: "Family-owned business with personalized service. We've been serving the community for 20 years.",
    rating: 4.9, services: ["Full Service Wash", "Bedding & Linens"],
    status: "Open Now", image: "/images/image2.png", location: "2.1 km", time: "24 hours"
  },
  {
    id: 3, verified: true, reviews: "220", title: "EcoWash Laundromat",
    description: "100% organic and eco-friendly cleaning solutions. Good for your clothes and the planet.",
    rating: 4.8, services: ["Eco Wash", "Organic Dry Clean"],
    status: "Closed", image: "/images/image3.png", location: "1.8 km", time: "24 hours"
  },
  { id: 4, title: "Fresh & Fold Express", verified: true, reviews: "93", status: "Open Now",
    rating: 4.7, description: "Quick turnaround times without compromising quality. Your neighbourhood laundry experts.",
    location: "1.2 km", time: "12 hours", services: ["Wash & Fold", "Dry Cleaning", "Express Service"],
    image: "/images/image4.png"
  },
  { id: 5, reviews: "66", title: "QuickPress Cleaners", verified: false, status: "Open Now",
    rating: 4.6, description: "Specializing in professional pressing and dry cleaning for business attire.",
    location: "3.0 km", time: "24 hours", services: ["Suit Cleaning", "Shirt Pressing", "Alterations"],
    image: "/images/image5.png"
  },
  { id: 6, title: "Urban Clean Co.", verified: true, reviews: "198", status: "Open Now",
    rating: 4.5, description: "Modern laundry service with app-based tracking and scheduling. The future of clean laundry.",
    location: "4.2 km", time: "18 hours", services: ["Smart Wash", "Premium Dry Clean", "Subscription Plan"],
    image: "/images/image6.png"
  }
]

const ShopDetail = () => {
  //const { id } = useParams()
  const {idLaundry} = useAuth();

  console.log("ShopDetail - id from URL:", idLaundry);
  const [selectedServices, setSelectedServices] = useState([])
  const shopId = parseInt(idLaundry)
  
  const baseShop = baseLaundries.find(l => l.id === shopId)
  const details = getShopDetails(shopId)
  const reviews = getShopReviews(shopId)
  
  // Merge base shop data with details
  const shop = baseShop ? {
    ...baseShop,
    ...details,
    // Use detailed services if available, otherwise use base services
    services: details.services.length > 0 ? details.services : baseShop.services
  } : null

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

  const handleServiceSelect = (serviceName) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    )
  }

  return (
    <main >
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img 
          src={shop.image} 
          alt={shop.title}
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
              <h1 className="text-3xl md:text-4xl font-bold">{shop.title}</h1>
              {shop.verified && (
                <span className="bg-[#0EA5C9] px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  <MdOutlineVerified /> Verified
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm ${
                shop.status === "Open Now" 
                  ? "bg-[#1BB38C] text-white" 
                  : "bg-red-500 text-white"
              }`}>
                {shop.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold">{shop.rating}</span>
                <span className="text-gray-300">({shop.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <IoLocationOutline />
                <span>{shop.fullAddress || shop.location}</span>
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
                
                {shop.features && shop.features.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {shop.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-[#E0F2FE] text-[#0EA5C9] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                      >
                        {feature === "Free Delivery" && <FaTruck />}
                        {feature === "Quick Service" && <FaClock />}
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Services Section */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1E2A36] mb-6">Services</h2>
                <div className="space-y-4">
                  {shop.services.map((service, index) => {
                    // Handle both string and object formats
                    const serviceName = typeof service === 'string' ? service : service.name
                    const serviceTime = typeof service === 'object' ? service.time : shop.time || "24 hours"
                    const servicePrice = typeof service === 'object' ? service.price : "Contact for pricing"
                    const isSelected = selectedServices.includes(serviceName)
                    
                    return (
                      <label
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? "border-[#0EA5C9] bg-[#E0F2FE]" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          checked={isSelected}
                          onChange={() => handleServiceSelect(serviceName)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-[#1E2A36]">{serviceName}</span>
                            <span className="text-[#0EA5C9] font-bold">{servicePrice}</span>
                          </div>
                          <span className="text-sm text-[#62707D]">Estimated: {serviceTime}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

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
                      <p className="text-[#1E2A36] font-medium">{shop.fullAddress || shop.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-sm text-[#62707D]">Hours</p>
                      <p className="text-[#1E2A36] font-medium">{shop.hours || "Mon-Sat: 7AM-8PM"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <IoCallOutline className="text-[#0EA5C9] text-xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#62707D]">Phone</p>
                      <a href={`tel:${shop.phone}`} className="text-[#1E2A36] font-medium hover:text-[#0EA5C9]">
                        {shop.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <IoMailOutline className="text-[#0EA5C9] text-xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#62707D]">Email</p>
                      <a href={`mailto:${shop.email}`} className="text-[#1E2A36] font-medium hover:text-[#0EA5C9]">
                        {shop.email}
                      </a>
                    </div>
                  </div>
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
