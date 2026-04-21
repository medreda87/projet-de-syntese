import React, { useState, useRef, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { Search, ArrowRight, Pause, Play } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.log('Video play failed:', error);
          setVideoError(true);
        });
      }
    }
  }, [isPaused]);

  useEffect(() => {
    // Try to play video on mount
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Initial video play failed:', error);
        setVideoError(true);
      });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shops?q=${searchQuery}`);
    }
  };

  const serviceCategories = [
    'Wash & Fold',
    'Dry Cleaning',
    'Ironing & Pressing',
    'Express Service',
    'Pickup & Delivery'
  ];

  const trustedCompanies = [
    { name: 'Meta', logo: 'M' },
    { name: 'Google', logo: 'G' },
    { name: 'NETFLIX', logo: 'N' },
    { name: 'P&G', logo: 'P&G' },
    { name: 'PayPal', logo: 'PP' },
    { name: 'Payoneer', logo: 'P' }
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Video Background */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: 'scale(1.05)',
            zIndex: 0
          }}
          poster="/images/Gemini_Generated_Image_24x83c24x83c24x8.png"
          onLoadedMetadata={(e) => {
            e.target.playbackRate = 0.8;
            e.target.play().catch(() => {
              setVideoError(true);
            });
          }}
          onError={() => {
            setVideoError(true);
          }}
        >
          <source src="/images/Laundry_Pickup_Service_Video_Generation.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-white/80 text-sm font-medium">Trusted by 500+ laundry providers</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Fresh clothes,<br />
            <span className="bg-gradient-to-r from-[#0C8CE9] to-[#06D6A0] bg-clip-text text-transparent">delivered to your door</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
            Find, compare, and book the best local laundry services. Pickup, cleaning, and delivery — all in one place.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8 max-w-2xl">
            <div className="flex items-center bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-white/20">
              <Search className="w-5 h-5 text-gray-400 ml-5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for laundry services near you..."
                className="flex-1 px-4 py-4 md:py-5 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none w-full text-base"
              />
              <button
                type="submit"
                className="bg-[#0C8CE9] hover:bg-[#0A6FC2] text-white px-6 py-3 md:py-4 mr-1.5 transition-all duration-200 flex items-center justify-center rounded-xl font-semibold text-sm gap-2"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Service Category Pills */}
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map((category, index) => (
             <Link to={`/shops/${category.replace(/\s+/g, '_').toLowerCase()}`} key={index}>
               <span
                 className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/90 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border border-white/10 cursor-pointer"
               >
                 {category}
               </span>
             </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pause/Play Button - Bottom Right */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute bottom-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 z-20"
        aria-label={isPaused ? 'Play' : 'Pause'}
      >
        {isPaused ? (
          <Play className="w-5 h-5 ml-0.5" />
        ) : (
          <Pause className="w-5 h-5" />
        )}
      </button>
    </section>
  );
};

export default HeroSection;
