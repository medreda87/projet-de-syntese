import React from 'react'
import Component16 from '../Components/Component16'
import Component9 from '../Components/Component9'
import Component18 from '../Components/Component18'
import Component14 from '../Components/Component14'

const BecomeProvider = () => {
  return (
    <main>
      <Component14 
        buttonText='Join 500+ providers'
        titlePart1='Grow Your Laundry Business with <span>FreshFold<span>'
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
        titlePart1="Why Partner with <span>FreshFold?</span>"
        description="We provide everything you need to succeed in the laundry business."
      />
      <Component16
        titlePart1="Ready to Get Started?"
        description="Fill out the form below and we'll get you set up in no time."
        onSubmit={(formData) => {
          console.log('Provider application submitted:', formData)
        }}
        
      />
     
     
    </main>
  )
}

export default BecomeProvider

