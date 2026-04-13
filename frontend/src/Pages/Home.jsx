import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Component9 from "../Components/Component9";
import Component20 from "../Components/Component20";
import Component3 from "../Components/Component3";
import HeroSection from "../Components/HeroSection";
import TitleSectionText from "../Components/ui/TitleSectionText";
import Item1 from "../Components/Item1";
import Component8 from "../Components/Component8";
import Component31 from "../Components/Component31";
import Reviews from "../Components/Reviews";
import axios from "axios";
import API from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { UserCheck, Store, LayoutDashboard } from "lucide-react";

const laundries = [
  {
    id: 1,
    verified: true,
    reviews: "135",
    title: "Sparkle Clean Laundry",
    description:
      "Premium laundry services with eco-friendly detergents. We take care of your clothes like they're our own.",
    rating: 4.9,
    services: ["Wash & Fold", "Dry Cleaning", "Ironing"],
    status: "Open Now",
    image: "/images/image1.png",
    location: "0.5 km",
    time: "24 hours",
  },
  {
    id: 2,
    verified: true,
    reviews: "320",
    title: "The Laundry Basket",
    description:
      "Family-owned business with personalized service. We've been serving the community for 20 years.",
    rating: 4.9,
    services: ["Full Service Wash", "Bedding & Linens"],
    status: "Open Now",
    image: "/images/image2.png",
    location: "2.1 km",
    time: "24 hours",
  },
  {
    id: 3,
    verified: true,
    reviews: "220",
    title: "EcoWash Laundromat",
    description:
      "100% organic and eco-friendly cleaning solutions. Good for your clothes and the planet.",
    rating: 4.8,
    services: ["Eco Wash", "Organic Dry Clean"],
    status: "Closed",
    image: "/images/image3.png",
    location: "1.8 km",
    time: "24 hours",
  },
  {
    id: 4,
    title: "Fresh & Fold Express",
    verified: true,
    reviews: "93",
    status: "Open Now",
    rating: 4.7,
    reviews: 189,
    description:
      "Quick turnaround times without compromising quality. Your neighbourhood laundry experts.",
    location: "1.2 km",
    time: "12 hours",
    services: ["Wash & Fold", "Dry Cleaning", "Express Service"],
    image: "/images/image4.png",
  },
  {
    id: 5,
    reviews: "66",
    title: "QuickPress Cleaners",
    verified: false,
    status: "Open Now",
    rating: 4.6,
    reviews: 98,
    description:
      "Specializing in professional pressing and dry cleaning for business attire.",
    location: "3.0 km",
    time: "24 hours",
    services: ["Suit Cleaning", "Shirt Pressing", "Alterations"],
    image: "/images/image5.png",
  },
  {
    id: 6,
    title: "Urban Clean Co.",
    verified: true,
    reviews: "198",
    status: "Open Now",
    rating: 4.5,
    reviews: 87,
    description:
      "Modern laundry service with app-based tracking and scheduling. The future of clean laundry.",
    location: "4.2 km",
    time: "18 hours",
    services: ["Smart Wash", "Premium Dry Clean", "Subscription Plan"],
    image: "/images/image6.png",
  },
];

// Sample testimonials for home page
const siteTestimonials = [
  {
    customerName: "Sarah Johnson",
    rating: 5,
    comment:
      "FreshFold has completely transformed how I handle laundry. Finding quality services in my area has never been easier. The platform is intuitive and the providers are all verified and professional.",
    location: "New York, NY",
    date: "2024-01-15",
  },
  {
    customerName: "Michael Chen",
    rating: 5,
    comment:
      "As a busy professional, FreshFold saves me so much time. I can compare prices, read reviews, and book services all in one place. The customer service is excellent too!",
    location: "Los Angeles, CA",
    date: "2024-01-20",
  },
  {
    customerName: "Emily Rodriguez",
    rating: 5,
    comment:
      "I love how transparent FreshFold is. I can see ratings, prices, and service details before booking. It's given me confidence to try new laundry services I wouldn't have found otherwise.",
    location: "Chicago, IL",
    date: "2024-01-25",
  },
  {
    customerName: "David Thompson",
    rating: 4.5,
    comment:
      "The platform is user-friendly and the booking process is seamless. I've used FreshFold multiple times and always had great experiences with the providers.",
    location: "Houston, TX",
    date: "2024-02-01",
  },
  {
    customerName: "Jessica Martinez",
    rating: 5,
    comment:
      "FreshFold has made laundry day so much easier. I can schedule pickups, track my orders, and everything is delivered back perfectly cleaned and folded. Highly recommend!",
    location: "Miami, FL",
    date: "2024-02-05",
  },
  {
    customerName: "Robert Williams",
    rating: 4.5,
    comment:
      "Great platform for finding reliable laundry services. The reviews are helpful and I've found some excellent providers through FreshFold. The app makes everything convenient.",
    location: "Seattle, WA",
    date: "2024-02-10",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const Home = () => {
  const { user, isAuthenticated, updateRole } = useAuth();
  const [laundries, setLaundries] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDashboardPrompt, setShowDashboardPrompt] = useState(false);

  // Show role modal 2 seconds after page loads for new users without a role
  useEffect(() => {
    if (isAuthenticated && user && !user.role) {
      const timer = setTimeout(() => {
        setShowRoleModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const getLaundries = async () => {
      try {
        const response = await API.get("/laundries");
        console.log("Fetched laundries:", response.data);
        setLaundries(response.data.data);
          

      } catch (error) {
        console.error("Error fetching laundries:", error);

      }
      setLoading(false);
    };
    getLaundries();
  }, []);

  const handleSelectRole = async () => {
    if (!selectedRole) return;
    setRoleLoading(true);
    const result = await updateRole(selectedRole);
    setRoleLoading(false);
    if (result.success) {
      setShowRoleModal(false);
      if (selectedRole === "provider") {
        setShowDashboardPrompt(true);
      }
    }
  };

  return (
    <main>
      <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
        <HeroSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideUpVariants}
      >
        <Component3 />
      </motion.div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="py-[70px]"
      >
        <motion.div className="container" variants={itemVariants}>
          <TitleSectionText
            titlePart1={"Featured <span>Laundry Shops<span>"}
            description={"Top-rated services in your area"}
          />
        </motion.div>

        <motion.div
          className="container-list  container"
          variants={staggerContainerVariants}
        >
          <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-3 grid-cols-1">
           {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0EA5C9] rounded-full animate-spin"></div>
                <p className="mt-4 text-[#62707D] text-sm">Loading laundries...</p>
              </div>
            ) : (
               laundries?.map((re, index) => (
               <motion.div
                 key={re.id}
                 className="col-span-1"
                 variants={itemVariants}
                 whileHover={{ scale: 1.02 }}
                 transition={{ duration: 0.2 }}
              >
                <Item1 {...re} />
              </motion.div>
            ))
           )}
          </div>
        </motion.div>
      </motion.section>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
      >
        <Component31 />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideUpVariants}
      >
        <Component8 />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
      >
        <Component9 />
      </motion.div>

      {/* Customer Testimonials Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <Reviews reviews={siteTestimonials} variant="testimonials" />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
      >

        {user?.role !== 'provider' && (
          <Component20 />
        )}

      </motion.div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#1E2A36] mb-2">
                Welcome to FreshFold!
              </h2>
              <p className="text-[#62707D]">
                How would you like to use our platform?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={`flex flex-col items-center gap-3 p-5 border-2 rounded-xl transition-all ${
                  selectedRole === "client"
                    ? "border-[#0EA5C9] bg-[#0EA5C9]/5 text-[#0EA5C9] shadow-md"
                    : "border-gray-200 hover:border-gray-300 text-[#62707D]"
                }`}
              >
                <UserCheck className="w-8 h-8" />
                <span className="font-semibold">Client</span>
                <span className="text-xs text-center opacity-70">
                  I want to use laundry services
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("provider")}
                className={`flex flex-col items-center gap-3 p-5 border-2 rounded-xl transition-all ${
                  selectedRole === "provider"
                    ? "border-[#0EA5C9] bg-[#0EA5C9]/5 text-[#0EA5C9] shadow-md"
                    : "border-gray-200 hover:border-gray-300 text-[#62707D]"
                }`}
              >
                <Store className="w-8 h-8" />
                <span className="font-semibold">Provider</span>
                <span className="text-xs text-center opacity-70">
                  I want to offer laundry services
                </span>
              </button>
            </div>

            <button
              onClick={handleSelectRole}
              disabled={!selectedRole || roleLoading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedRole
                  ? "bg-[#0EA5C9] text-white hover:bg-[#0d94b8]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {roleLoading ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Prompt for Providers */}
      {showDashboardPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <LayoutDashboard className="w-12 h-12 text-[#0EA5C9] mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-[#1E2A36] mb-2">
                Go to your Dashboard?
              </h2>
              <p className="text-[#62707D]">
                You can manage your laundry services from your provider
                dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDashboardPrompt(false)}
                className="flex-1 py-3 rounded-lg font-medium border-2 border-gray-200 text-[#62707D] hover:border-gray-300 transition-colors"
              >
                Stay Here
              </button>
              <button
                onClick={() => {
                  window.open("http://localhost:3001", "_blank");
                  setShowDashboardPrompt(false);
                }}
                className="flex-1 py-3 rounded-lg font-medium bg-[#0EA5C9] text-white hover:bg-[#0d94b8] transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
