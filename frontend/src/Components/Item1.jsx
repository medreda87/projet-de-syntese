import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineVerified } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { useAuth } from '../contexts/AuthContext';
function Item1(props){
  const navigate = useNavigate()

  const {idLaundry , setIdLaundry} = useAuth();
  
  const handleClick = () => {
    setIdLaundry(props.id);
    console.log("Laundry ID set to:", idLaundry);
    navigate(`/shop/${props.title}`)
  }
  
  return (
    <div className='card cursor-pointer hover:shadow-lg transition-shadow' onClick={handleClick}>
        <div className='card-image'>
                <div className='flex items-center absolute z-[111] gap-4 left-[10px] top-[10px]'>
                    <span className='flex text-primary bg-white text-[15px] py-1 px-4 rounded-full items-center'><MdOutlineVerified/>Verified</span>
                    <span className={props.status === "Closed" ? " py-1 text-[15px reda" : "badge py-1 text-[15px] closed"}>{props.status}</span>
                </div>

            
            <img src={props.image} alt="" />
        </div>
        <div className='card-content'>
            <div className='card-header'>
                <h3>{props.title}</h3>
                <div className='rating'>
                    <p><strong>⭐{props.rating}</strong>({props.reviews})</p>
                </div>
            </div>
                <p className='description'>{props.description}</p>

            <div className='meta '>
                <p className='flex items-center'><span><IoLocationOutline/></span>{props.time}</p>
            </div>
            <div className='tags'>
            {
                props.services.map((re,index)=>(
                        <span key={index}>{re}</span>
                ))
            }
            </div>

        </div>
    </div>
  )
}

export default Item1