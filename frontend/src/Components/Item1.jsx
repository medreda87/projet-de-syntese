import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineVerified } from "react-icons/md";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { useAuth } from '../contexts/AuthContext';

function Item1(props){
  const navigate = useNavigate()
  const {idLaundry , setIdLaundry} = useAuth();
  
  const handleClick = () => {
    setIdLaundry(props.id);
    const title = props.name.replace(/\s+/g, '_').toLowerCase();
    navigate(`/${title}?laundry_id=${props.id}`);
  }
  
  const isOpen = props.status !== "Closed"

  
  return (
    <div 
      className='group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-transparent hover:-translate-y-1 h-full flex flex-col'
      onClick={handleClick}
    >
      {/* Image */}
      <div className='relative overflow-hidden h-[200px]'>
        <img 
          src={`${props.logo}`} 
          alt={props.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className='flex items-center gap-2 absolute z-10 left-3 top-3'>
          {props.verified && (
            <span className='flex items-center gap-1 text-[#0C8CE9] bg-white/95 backdrop-blur-sm text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm'>
              <MdOutlineVerified className="text-sm" /> Verified
            </span>
          )}
          <span className={`text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm backdrop-blur-sm ${
            isOpen 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-gray-500/90 text-white'
          }`}>
            {props.is_active ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Rating pill on image */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-[#0F172A] text-xs font-bold">{Number(props.comments_avg_rating).toFixed(1)}</span>
          <span className="text-[#64748B] text-xs">({props.comments_count})</span>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-1'>
        <h3 className='font-bold text-[#0F172A] text-base mb-1.5 group-hover:text-[#0C8CE9] transition-colors leading-tight'>
          {props.name}
        </h3>
        
        <p className='text-[#64748B] text-sm leading-relaxed mb-3 line-clamp-2 flex-1'>
          {props.description}
        </p>

        {/* Meta info */}
        <div className='flex items-center gap-3 text-xs text-[#64748B] mb-3'>
          {props.city && (
            <span className='flex items-center gap-1'>
              <IoLocationOutline className="text-[#0C8CE9] text-sm" />
              {props.city}
            </span>
          )}
          {props.time && (
            <span className='flex items-center gap-1'>
              <IoTimeOutline className="text-[#0C8CE9] text-sm" />
              {props.time}
            </span>
          )}
        </div>
        
        {/* Service tags */}
        <div className='flex flex-wrap gap-1.5'>
          {props.services?.map((re, index) => (
            <span 
              key={index} 
              className="text-[11px] font-medium text-[#0C8CE9] bg-[#0C8CE9]/8 px-2.5 py-1 rounded-md"
            >
              {re.name}
            </span>
          ))}
          {props.services?.length > 3 && (
            <span className="text-[11px] font-medium text-[#64748B] bg-gray-100 px-2.5 py-1 rounded-md">
              +{props.services.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Item1