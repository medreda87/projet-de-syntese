import React from 'react'
import { motion } from 'framer-motion'
import Component14 from '../Components/Component14'
import Component18 from '../Components/Component18'
import Component17 from '../Components/Component17'
import Component30 from '../Components/Component30'
import Component20 from '../Components/Component20'
import Component21 from '../Components/Component21'
import Component19 from '../Components/Component19'
import Reviews from '../Components/Reviews'
import { useAuth } from '../contexts/AuthContext'

// Sample testimonials for About page
const aboutTestimonials = [
  {
    customerName: "Sarah Johnson",
    rating: 5,
    comment: "FreshFold has completely transformed how I handle laundry. Finding quality services in my area has never been easier. The platform is intuitive and the providers are all verified and professional.",
    location: "New York, NY",
    date: "2024-01-15"
  },
  {
    customerName: "Michael Chen",
    rating: 5,
    comment: "As a busy professional, FreshFold saves me hours every week. I can book pickup and delivery with just a few clicks, and the service quality has been consistently excellent.",
    location: "San Francisco, CA",
    date: "2024-01-20"
  },
  {
    customerName: "Emily Rodriguez",
    rating: 5,
    comment: "I love how transparent FreshFold is. I can see reviews, prices, and service options before booking. It's given me confidence to try new providers and I've never been disappointed.",
    location: "Los Angeles, CA",
    date: "2024-02-01"
  },
  {
    customerName: "David Thompson",
    rating: 4.5,
    comment: "The convenience factor is unbeatable. I can schedule everything from my phone, track my order, and get notifications. FreshFold has made laundry day stress-free.",
    location: "Chicago, IL",
    date: "2024-02-10"
  },
  {
    customerName: "Jessica Martinez",
    rating: 5,
    comment: "What I appreciate most is the variety of providers available. Whether I need express service or eco-friendly options, FreshFold has it all. The customer support is also top-notch.",
    location: "Miami, FL",
    date: "2024-02-15"
  },
  {
    customerName: "Robert Kim",
    rating: 5,
    comment: "FreshFold has been a game-changer for my family. We can compare prices and services easily, and the providers we've used have all been reliable and professional. Highly recommend!",
    location: "Seattle, WA",
    date: "2024-02-20"
  }
]

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const About = () => {

  const {user} = useAuth()
  return (
    <main >
      <Component14
        buttonText="About FreshFold"
        titlePart1="About <span>FreshFold</span>"
        description="We're building the future of laundry services — connecting customers with trusted local providers for a seamless, hassle-free experience."
        image='/images/about.png'
      />
      <Component17 />

      <Component30 />
      <Component18
        titlePart1="How We <span>Help</span>"
        description="FreshFold creates value for both customers and service providers"
      />
      
      
      <Component19 />

      {/* Customer Testimonials Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
      >
        <Reviews 
          reviews={aboutTestimonials}
          variant="testimonials"
        />
      </motion.div>

      {
        user.role === 'customer' && (
           <Component20 />
        )
      }
    </main>
  )
}

export default About

