import React, { useEffect, useState } from 'react'
import Filter1 from './Filter1'
import { IoSearchOutline } from "react-icons/io5";
import Item1 from './Item1';
import { useParams } from 'react-router-dom';

function List1() {

  const {service} = useParams()
  


//  hadi la liste we les information dekol mesbana 
    let laundries = [
  {
    id: 1,
    verified: true,
    reviews:"135",
    title: "Sparkle Clean Laundry",
    description: "Premium laundry services with eco-friendly detergents. We take care of your clothes like they're our own.",
    rating: 4.9,
    services: ["Wash & Fold", "Dry Cleaning", "Ironing"],
    status: "Open Now",
    image:"/images/image1.png",
    location: "0.5 km",
    city: "Casablanca",
    time: "24 hours",
  },
  {
    id: 2,
    verified: true,
    reviews:"320",
    title: "The Laundry Basket",
    description:"Family-owned business with personalized service. We've been serving the community for 20 years.",
    rating: 4.9,
    services: ["Full Service Wash", "Bedding & Linens"],
    status: "Open Now",
    image:"/images/image2.png",
    location: "2.1 km",
    city: "Rabat",
    time: "24 hours",
  },
  {
    id: 3,
    verified: true,
    reviews:"220",
    title: "EcoWash Laundromat",
    description:"100% organic and eco-friendly cleaning solutions. Good for your clothes and the planet.",
    rating: 4.8,
    services: ["Eco Wash", "Organic Dry Clean"],
    status: "Closed",
    image:"/images/image3.png",
    location: "1.8 km",
    city: "Marrakech",
    time: "24 hours",
  },
  { id:4,
    title: "Fresh & Fold Express",
    verified: true,
    reviews:"93",
    status: "Open Now",
    rating: 4.7,
    reviews: 189,
    description:"Quick turnaround times without compromising quality. Your neighbourhood laundry experts.",
    location: "1.2 km",
    city: "Casablanca",
    time: "12 hours",
    services: ["Wash & Fold", "Dry Cleaning", "Express Service"],
    image:"/images/image4.png",
  },
      {
    id:5,
    reviews:"66",
    title: "QuickPress Cleaners",
    verified: false,
    status: "Open Now",
    rating: 4.6,
    reviews: 98,
    description:
      "Specializing in professional pressing and dry cleaning for business attire.",
    location: "3.0 km",
    city: "Fes",
    time: "24 hours",
    services: ["Suit Cleaning", "Shirt Pressing", "Alterations"],
    image:"/images/image5.png",
  },
  {
    id:6,
    title: "Urban Clean Co.",
    verified: true,
    reviews:"198",
    status: "Open Now",
    rating: 4.5,
    reviews: 87,
    description:
      "Modern laundry service with app-based tracking and scheduling. The future of clean laundry.",
    location: "4.2 km",
    city: "Tangier",
    time: "18 hours",
    services: ["Smart Wash", "Premium Dry Clean", "Subscription Plan"],
    image:"/images/image6.png",
  },
  {
    id: 7,
    verified: true,
    reviews: "245",
    title: "Crystal Clear Laundry",
    description: "Professional dry cleaning and laundry services with same-day service available. Your trusted neighborhood cleaners.",
    rating: 4.8,
    services: ["Dry Cleaning", "Wash & Fold", "Same-Day Service"],
    status: "Open Now",
    image: "/images/image1.png",
    location: "0.8 km",
    city: "Agadir",
    time: "6 hours",
  },
  {
    id: 8,
    verified: true,
    reviews: "156",
    title: "Sunshine Laundromat",
    description: "Bright, clean facility with state-of-the-art equipment. Self-service and full-service options available.",
    rating: 4.6,
    services: ["Self-Service", "Full Service Wash", "Dry Cleaning"],
    status: "Open Now",
    image: "/images/image2.png",
    location: "1.5 km",
    city: "Meknes",
    time: "24 hours",
  },
  {
    id: 9,
    verified: false,
    reviews: "78",
    title: "Deluxe Cleaners",
    description: "Premium laundry and dry cleaning services for the discerning customer. Specializing in luxury fabrics.",
    rating: 4.9,
    services: ["Luxury Dry Clean", "Premium Wash", "Alterations"],
    status: "Open Now",
    image: "/images/image3.png",
    location: "2.5 km",
    city: "Casablanca",
    time: "48 hours",
  },
  {
    id: 10,
    verified: true,
    reviews: "312",
    title: "Neighborhood Wash",
    description: "Family-friendly laundry service with competitive pricing. We've been your neighborhood choice for over 15 years.",
    rating: 4.7,
    services: ["Wash & Fold", "Bedding & Linens", "Bulk Service"],
    status: "Open Now",
    image: "/images/image4.png",
    location: "0.9 km",
    city: "Rabat",
    time: "24 hours",
  },
  {
    id: 11,
    verified: true,
    reviews: "189",
    title: "Green Clean Laundry",
    description: "Eco-conscious laundry service using only biodegradable detergents and energy-efficient machines.",
    rating: 4.7,
    services: ["Eco Wash", "Organic Dry Clean", "Green Cleaning"],
    status: "Open Now",
    image: "/images/image5.png",
    location: "1.7 km",
    city: "Marrakech",
    time: "24 hours",
  },
  {
    id: 12,
    verified: true,
    reviews: "267",
    title: "Express Laundry Hub",
    description: "Fast and reliable laundry service with express options. Perfect for busy professionals and families.",
    rating: 4.6,
    services: ["Express Wash", "Dry Cleaning", "Pickup & Delivery"],
    status: "Open Now",
    image: "/images/image6.png",
    location: "1.3 km",
    city: "Casablanca",
    time: "4 hours",
  },
  {
    id: 13,
    verified: true,
    reviews: "145",
    title: "Classic Cleaners",
    description: "Traditional dry cleaning with modern techniques. Expert care for your finest garments.",
    rating: 4.8,
    services: ["Dry Cleaning", "Suit Cleaning", "Wedding Dress Care"],
    status: "Open Now",
    image: "/images/image1.png",
    location: "2.8 km",
    city: "Fes",
    time: "48 hours",
  },
  {
    id: 14,
    verified: false,
    reviews: "92",
    title: "24/7 Wash Center",
    description: "Round-the-clock self-service laundry facility. Clean, secure, and always available when you need it.",
    rating: 4.4,
    services: ["Self-Service", "24/7 Access", "Coin & Card Payment"],
    status: "Open Now",
    image: "/images/image2.png",
    location: "1.1 km",
    city: "Tangier",
    time: "24 hours",
  },
  {
    id: 15,
    verified: true,
    reviews: "203",
    title: "Premium Press & Clean",
    description: "Specialized in professional pressing and garment care. Making you look your best, one garment at a time.",
    rating: 4.9,
    services: ["Shirt Pressing", "Suit Cleaning", "Garment Care"],
    status: "Open Now",
    image: "/images/image3.png",
    location: "3.2 km",
    city: "Rabat",
    time: "24 hours",
  },
  {
    id: 16,
    verified: true,
    reviews: "178",
    title: "Fresh Start Laundry",
    description: "New beginnings start with fresh, clean clothes. Affordable prices with premium quality service.",
    rating: 4.5,
    services: ["Wash & Fold", "Dry Cleaning", "Bulk Discounts"],
    status: "Closed",
    image: "/images/image4.png",
    location: "2.0 km",
    city: "Marrakech",
    time: "24 hours",
  },
  {
    id: 17,
    verified: true,
    reviews: "234",
    title: "Smart Wash Solutions",
    description: "Technology-driven laundry service with mobile app integration. Track your laundry in real-time.",
    rating: 4.7,
    services: ["Smart Wash", "App Tracking", "Subscription Plans"],
    status: "Open Now",
    image: "/images/image5.png",
    location: "1.6 km",
    city: "Casablanca",
    time: "12 hours",
  },
  {
    id: 18,
    verified: true,
    reviews: "301",
    title: "Community Laundry Co.",
    description: "Supporting local community with affordable, quality laundry services. Your neighborhood's trusted choice.",
    rating: 4.8,
    services: ["Community Service", "Wash & Fold", "Student Discounts"],
    status: "Open Now",
    image: "/images/image6.png",
    location: "0.7 km",
    city: "Agadir",
    time: "24 hours",
  }
];
const [filter, setFilter] = useState("All Services");
const [selectedCity, setSelectedCity] = useState("All Cities");


useEffect(()=>{
  service && setFilter(service)
},[])



// le traitement de input search
  const[search,setSearch]=useState("")
  const SearchProduct=laundries.filter((p)=>p.title.toLowerCase().includes(search.toLowerCase()))

// clean search li katban hta maknjbro hta mesbana 
  const handleSearch=()=>{
    setSearch("")
    setFilter("All Services");
    setSelectedCity("All Cities");
    setSortType("rating");
  }




//  hadi deya les button  ya3ni kol button kayfilter 3la hsan sevices 
  const filteredByService = filter === "All Services"? SearchProduct: SearchProduct.filter((laundry) =>laundry.services.includes(filter));
  
  // Filter by city
  const filteredLaundries = selectedCity === "All Cities" 
    ? filteredByService 
    : filteredByService.filter((laundry) => laundry.city === selectedCity);
// hadi sort deyal rating we mili neckliki mara tanya 
const [sortType, setSortType] = useState("rating"); 
const sortedLaundries = [...filteredLaundries].sort((a, b) => {
  if (sortType === "rating") {
    return b.rating - a.rating;
  } else {
    return b.reviews - a.reviews;
  }
});


//  hadi de button clear all  hadi kat3mel clean rir les button 
const isDirty =
  filter !== "All Services" ||
  selectedCity !== "All Cities" ||
  sortType !== "rating";
  const handleClear=()=>{
    setFilter("All Services");
    setSelectedCity("All Cities");
    setSortType("rating");
  }
  return (
<div className="main-content mx-auto">
  <div style={{backgroundColor:'#f4f7f7', fontSize:"20px"}}>
    <Filter1 search={search} setSearch={setSearch}
      filter={filter} setFilter={setFilter}
      sortType={sortType} setSortType={setSortType}
      isDirty={isDirty} handleClear={handleClear}
      onhandleFilter={handleSearch}
      selectedCity={selectedCity} setSelectedCity={setSelectedCity}
    />
  </div>

  <div className='px-4 md:px-8 py-10 max-w-7xl mx-auto'>
    <div className="mb-6">
      {search
        ? <h2 className='text-2xl font-bold text-[#1E2A36]'>Results for "<span className='text-[#0EA5C9]'>{search}</span>"</h2>
        : <h2 className='text-2xl font-bold text-[#1E2A36]'>All <span className='text-[#0EA5C9]'>Laundry Shops</span></h2>}
      <p className='text-sm text-[#62707D] mt-1'>{sortedLaundries.length} shops found</p>
    </div>

    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
      {sortedLaundries.map((re) => (
       <div key={re.id} className='col-span-1'>
         <Item1 {...re} />
       </div>
      ))}

      {sortedLaundries.length===0 && (
        <div className='col-span-full flex flex-col items-center justify-center py-20 text-center'>
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <IoSearchOutline className="text-2xl text-[#62707D]" />
          </div>
          <h2 className='text-xl font-bold text-[#1E2A36] mb-2'>No shops found</h2>
          <p className='text-[#62707D] text-sm mb-5 max-w-sm'>Try adjusting your filters or search query to find what you're looking for</p>
          <button 
            className="px-6 py-2.5 rounded-xl bg-[#0EA5C9] text-white text-sm font-semibold hover:bg-[#0EA5C9]/90 transition-colors" 
            onClick={()=>handleClear()}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  </div>
</div>

  )
}

export default List1