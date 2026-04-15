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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
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
            transform: 'scale(1.1)',
            zIndex: 0
          }}
          poster="/images/Gemini_Generated_Image_24x83c24x83c24x8.png"
          onLoadedMetadata={(e) => {
            e.target.playbackRate = 0.8; // Slightly slower for cinematic effect
            e.target.play().catch((error) => {
              console.log('Video autoplay failed:', error);
              setVideoError(true);
            });
          }}
          onError={() => {
            // Fallback to image if video fails to load
            console.log('Video failed to load, using fallback image');
            setVideoError(true);
          }}
        >
          <source src="/images/Laundry_Pickup_Service_Video_Generation.mp4" type="video/mp4" />
          {/* Fallback message for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Fallback Background Image */}
      
      
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black  to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10 w-full">
        <div className="max-w-5xl">
          {/* Headline - Left aligned */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-tight">
            <span className='text-primary'>FreshFold</span><br />
            <span className="text-white">will take it from here</span>
          </h1>

          {/* Search Bar - Centered */}
          <form onSubmit={handleSearch} className="mb-8 ">
            <div className="flex items-center bg-white px-2 py-0 rounded-xl overflow-hidden shadow-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for any service..."
                className="flex-1 px-6 py-5 text-gray-800 placeholder-gray-400 focus:outline-none w-full text-lg"
              />
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 transition-colors duration-200 flex items-center justify-center rounded-xl"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* Service Category Buttons */}
          <div className="flex flex-wrap gap-3 mb-16">
            {serviceCategories.map((category, index) => (
             <Link to={`/shops/${category.replace(/\s+/g, '_').toLowerCase()}`} key={index}>
               <button
                 key={index}
                 className="bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 text-sm md:text-base font-medium"
               >
                 <span>{category}</span>
                 <ArrowRight className="w-4 h-4" />
               </button>
             </Link>
            ))}
          </div>

          {/* Trusted By Section - Bottom Left */}
          
        </div>
      </div>

      {/* Pause/Play Button - Bottom Right */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute bottom-8 right-8 w-14 h-14 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 z-20 shadow-lg"
        aria-label={isPaused ? 'Play' : 'Pause'}
      >
        {isPaused ? (
          <Play className="w-6 h-6 ml-1" />
        ) : (
          <Pause className="w-6 h-6" />
        )}
      </button>
    </section>
  );
};

export default HeroSection;
