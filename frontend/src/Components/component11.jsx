import React from 'react'
import { IoPeople } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
function Component11() {
    const navigate=useNavigate()
  return (
    <div>
        <section className="provider-hero">
        <h1>Are You a Laundry Service Provider?</h1>

        <p className="subtitle">
            Join FreshFold and connect with customers looking for quality laundry services.
            It's free to get started!
        </p>

        <div className="features">
            <span><IoPeople color='ffffff'/> Reach thousands of customers</span>
            <span><FaArrowTrendUp color='ffffff'/> Grow your business online</span>
            <span><FaDollarSign color='ffffff'/> Increase your revenue</span>
        </div>

        <button className="provider-btn" onClick={()=>navigate('provider')}>
            Become a Provider →
        </button>
        </section>
</div>
  )
}

export default Component11