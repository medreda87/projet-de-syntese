import React, { Component } from 'react'
import Component14 from '../Components/Component14'
import Component21 from '../Components/Component21'
import Component22 from '../Components/Component22'
import Component20 from '../Components/Component20'
import { useAuth } from '../contexts/AuthContext'

const Contact = () => {

  const {user} = useAuth()
  return (
    <main className="pt-20">
      <Component14
        buttonText = "Get in Touch"
        titlePart1 = "We're Here to <span>Help</span>"
        description = "Have a question, feedback, or need assistance? Our team is ready to help you get the most out of FreshFold."
      />
      <Component21 emailCard = {{
             title : "Email Us",
            subtitle: "We'll respond within 24 hours",
            contact: "support@freshfold.com"
        }}
      phoneCard = {{
        title: "Call Us",
        subtitle: "Mon-Fri 9AM-6PM",
        contact: "+1 (555) 123-4567"
      }}
      visitCard ={{
        title: "Visit Us",
        subtitle: "Our headquarters",
        contact: "123 Market Street, SF"
      }}/>

      <Component22 />
       {
        user.role === 'customer' && (
           <Component20 />
        )
      }
    </main>
  )
}

export default Contact

