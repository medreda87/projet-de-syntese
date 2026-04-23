import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Component9 from '../Components/Component9'
import Component14 from '../Components/Component14'
import BecomeProviderModal from '../Components/BecomeProviderModal'
import { useAuth } from '../contexts/AuthContext'

const BecomeProvider = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  // If already a provider redirect straight to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === 'provider') {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  // Auto-open the modal when authenticated customer/client lands here
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'customer' || user?.role === 'client')) {
      setShowModal(true)
    }
  }, [isAuthenticated, user])

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/become-provider' } })
    } else {
      setShowModal(true)
    }
  }

  return (
    <main>
      <Component14
        buttonText={isAuthenticated ? 'Set up my laundry' : 'Join 500+ providers'}
        onButtonClick={handleGetStarted}
        titlePart1='Grow Your Laundry Business with <span>Mesbanati</span>'
        description='Whether you own a laundry shop or provide individual services, join our marketplace and connect with customers in your area.'
        steps={[
          "Create your free account",
          "Set up your business profile",
          "List your services and prices",
          "Start receiving customer requests"
        ]}
        image='/images/provider.png'
      />
      <Component9
        titlePart1="Why Partner with <span>Mesbanati?</span>"
        description="We provide everything you need to succeed in the laundry business."
      />

      {showModal && <BecomeProviderModal onClose={() => setShowModal(false)} />}
    </main>
  )
}

export default BecomeProvider


