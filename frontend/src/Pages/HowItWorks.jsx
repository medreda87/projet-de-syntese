import React from 'react'
import Component23 from '../Components/Component23'
import Component24 from '../Components/Component24'
import { 
  FaSearch, 
  FaBalanceScale, 
  FaCalendarPlus, 
  FaTruck, 
  FaStar,
  FaBell,
  FaHandPaper,
  FaSprayCan,
  FaBox,
  FaTruckLoading
} from 'react-icons/fa'
import Component14 from '../Components/Component14'
import Component20 from '../Components/Component20'
import { useAuth } from '../contexts/AuthContext'

const HowItWorks = () => {

  const {user} = useAuth();
  return (
    <main>

        <Component14
            buttonText = "About Mesbanati"
            titlePart1 = "How <span>Mesbanati</span> Works"
            image='/images/howitWorks.png'
            description = "Whether you're looking for laundry services or offering them, our platform makes it simple, secure, and efficient."
        />
        <Component23
        tagText="For Customers"
        titlePart1="Getting started is <br/><span>easy</span>"
        
        description="Book your first laundry service in minutes and enjoy fresh, perfectly cleaned clothes without the hassle."
        rightSideItems={[
          {
            icon: FaSearch,
            title: "Find Providers",
            description: "Browse local laundry shops and independent providers. Use filters to find the perfect match for your needs."
          },
          {
            icon: FaBalanceScale,
            title: "Compare Options",
            description: "View detailed profiles, services, prices, and customer reviews. Make informed decisions with complete transparency."
          },
          {
            icon: FaCalendarPlus,
            title: "Book Service",
            description: "Select your services, choose pickup time, and confirm your booking in just a few clicks."
          },
          {
            icon: FaTruck,
            title: "Receive Delivery",
            description: "Track your order in real-time. Get fresh, clean clothes delivered right to your doorstep."
          },
          {
            icon: FaStar,
            title: "Rate & Review",
            description: "Share your experience to help others find quality services and reward great providers."
          }
        ]}
      />
      <Component23
        tagText="For Providers"
        titlePart1="Grow your laundry  <br/><span>business</span>"
        description="Join our marketplace and reach thousands of customers"
        image="/images/customer.png"
        variant="provider"
        rightSideItems={[
          {
            icon: FaBell,
            title: "Receive Order Notification",
            description: "Get instant notifications when customers place orders. Review order details including pickup address, date, and time."
          },
          {
            icon: FaHandPaper,
            title: "Pickup Laundry",
            description: "Visit the customer's location at the scheduled pickup time. Collect the laundry items and confirm receipt with the customer."
          },
          {
            icon: FaSprayCan,
            title: "Process & Clean",
            description: "Process the laundry according to the service requested. Wash, dry, fold, or dry clean based on customer preferences."
          },
          {
            icon: FaBox,
            title: "Prepare for Delivery",
            description: "Package the cleaned items carefully. Organize everything according to the delivery schedule and prepare for transport."
          },
          {
            icon: FaTruckLoading,
            title: "Deliver to Customer",
            description: "Deliver the cleaned laundry to the customer's specified address at the agreed time. Complete the order and collect payment."
          }
        ]}
      />
      <Component24 />
      {
        user?.role !== 'provider' && (
           <Component20 />
        )
      }
    </main>
  )
}

export default HowItWorks

