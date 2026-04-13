import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './ui/Icon'
import Button from './Button'
import { FaArrowLeft, FaCheck, FaMapMarkerAlt, FaCheckCircle, FaTimes, FaInfoCircle } from 'react-icons/fa'
import LocationForm from './Location'
import { sendEmail } from '../utils/send_email'
import API from '../utils/api'
import { useLocation, useNavigate } from 'react-router-dom'

// Parse openingHours string to get working day numbers (0=Sun, 1=Mon, ..., 6=Sat)
const DAY_MAP = { 'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6 }

const parseWorkingDays = (openingHours) => {
  if (!openingHours) return [0, 1, 2, 3, 4, 5, 6] // all days if not specified
  const text = openingHours.toLowerCase()
  const workingDays = new Set()

  // Match patterns like "Mon-Fri", "Mon-Sat", "Lun-Ven", "Lun-Sam"
  const frDayMap = { 'lun': 1, 'mar': 2, 'mer': 3, 'jeu': 4, 'ven': 5, 'sam': 6, 'dim': 0 }
  const allDayMap = { ...DAY_MAP, ...frDayMap }

  const rangeRegex = /([a-zé]+)\s*[-–àa]\s*([a-zé]+)/gi
  let match
  while ((match = rangeRegex.exec(text)) !== null) {
    const startDay = allDayMap[match[1].substring(0, 3)]
    const endDay = allDayMap[match[2].substring(0, 3)]
    if (startDay !== undefined && endDay !== undefined) {
      let d = startDay
      while (true) {
        workingDays.add(d)
        if (d === endDay) break
        d = (d + 1) % 7
      }
    }
  }

  // Match individual days
  for (const [key, val] of Object.entries(allDayMap)) {
    if (text.includes(key)) workingDays.add(val)
  }

  return workingDays.size > 0 ? Array.from(workingDays) : [0, 1, 2, 3, 4, 5, 6]
}

const getTodayStr = () => {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

const getDayName = (dayNum) => {
  return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][dayNum]
}

const Checkout = ({
  initialStep = 1,
  onBackToHome,
  onSubmit,
  orderSummary = {
    deliveryInfo: {
      title: "Livraison payante",
      message: "Si le prix du ramassage est supérieur à 100 DH, la livraison sera gratuite"
    }
  },
  onUseCurrentLocation,
  mapComponent = null
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [allFormData, setAllFormData] = useState({
    // Step 1 data
    fullName: "Imran",
    phoneNumber: "0687910242",
    saveInfo: true,
    // Step 2 data
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    // Step 3 data
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: ""
  })
  const location = useLocation()

  const selectedServices = location.state?.form ?? JSON.parse(localStorage.getItem('checkoutServices') || '[]')
  const laundryId = location.state?.laundryId ?? JSON.parse(localStorage.getItem('checkoutLaundryId') || 'null')

  const [errors , setErros ] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [laundry, setLaundry] = useState(null)
  const [workingDays, setWorkingDays] = useState([0, 1, 2, 3, 4, 5, 6])

  useEffect(() => {
    if (laundryId) {
      API.get(`/laundries/${laundryId}`).then(res => {
        const l = res.data.laundry || res.data
        setLaundry(l)
        setWorkingDays(parseWorkingDays(l.openingHours))
      }).catch(() => {})
    }
  }, [laundryId])

  const isWorkingDay = (dateStr) => {
    if (!dateStr) return true
    const d = new Date(dateStr + 'T00:00:00')
    return workingDays.includes(d.getDay())
  }

  const isNotPastDate = (dateStr) => {
    if (!dateStr) return true
    return dateStr >= getTodayStr()
  }

  const isDeliveryAfterPickup = (deliveryDate) => {
    if (!deliveryDate || !allFormData.pickupDate) return true
    return deliveryDate >= allFormData.pickupDate
  }

  const validate=(currentStep)=>{
    if(currentStep === 1 ){
      if(!allFormData.fullName){
      
        setErros({
          ...errors , fullName :"Please enter your name"
        })
        return false
      }
      else if(!allFormData.phoneNumber){
        setErros({
          ...errors , phoneNumber :"Please enter your name"
        })
        return false 
      }

      return true
      
    }
    if(currentStep === 2){
      if(!allFormData.pickupAddress){
        setErros({
          ...errors , pickupAddress :"Please enter your adresse"
        })
        return false 

      }
      else if(!allFormData.pickupDate){
        setErros({
          ...errors , pickupDate :"Please enter date of pickup"
        })
        return false 

      }
      else if(!isNotPastDate(allFormData.pickupDate)){
        setErros({
          ...errors , pickupDate :"La date de ramassage ne peut pas être dans le passé"
        })
        return false
      }
      else if(!isWorkingDay(allFormData.pickupDate)){
        const d = new Date(allFormData.pickupDate + 'T00:00:00')
        setErros({
          ...errors , pickupDate :`La pressing ne travaille pas le ${getDayName(d.getDay())}`
        })
        return false
      }
      else if(!allFormData.pickupTime){
        setErros({
          ...errors , pickupTime :"Please enter time of pickup"
        })
        return false 
      }
      return true
    }

    if(!allFormData.deliveryAddress){
      setErros({
        ...errors , deliveryAddress :"Please enter your adresse"
      })
      return false 

    }
    if(!allFormData.deliveryDate){
      setErros({
        ...errors , deliveryDate :"Please enter date of delivery"
      })
      return false 
      
    }
    if(!isNotPastDate(allFormData.deliveryDate)){
      setErros({
        ...errors , deliveryDate :"La date de livraison ne peut pas être dans le passé"
      })
      return false
    }
    if(!isWorkingDay(allFormData.deliveryDate)){
      const d = new Date(allFormData.deliveryDate + 'T00:00:00')
      setErros({
        ...errors , deliveryDate :`La pressing ne travaille pas le ${getDayName(d.getDay())}`
      })
      return false
    }
    if(!isDeliveryAfterPickup(allFormData.deliveryDate)){
      setErros({
        ...errors , deliveryDate :"La date de livraison doit être après la date de ramassage"
      })
      return false
    }
    if(!allFormData.deliveryTime){
      setErros({
        ...errors , pickupTime :"Please enter time of pickup"
      })
      return false 
    }
    return true
  }

  const [positionRamassage, setPositionRamassage] = useState({
    latitude: 35.74804478729811,
    longitude: -5.818333625793458,
  });
  const [positionLivraison, setPositionLivraison] = useState({
    latitude: 35.74804478729811,
    longitude: -5.818333625793458,
  });

  const handleStep1Change = (e) => {
    const { name, value, type, checked } = e.target
    setAllFormData({
      ...allFormData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleStep2Change = (e) => {
    const { name, value } = e.target
    setAllFormData({
      ...allFormData,
      [name]: value
    })
  }

  const handleStep3Change = (e) => {
    const { name, value } = e.target
    setAllFormData({
      ...allFormData,
      [name]: value
    })
  }

  const handleNext = () => {
    if (currentStep < 3) {
   
      if(currentStep == 2){
        setAllFormData({
          ...allFormData , locationRamassage : positionRamassage
        })
      }

      if(validate(currentStep)){
        
        setCurrentStep(currentStep + 1)
      }
    } 
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBackToHome && onBackToHome()
    }
  }

  const handleFinalSubmit = () => {
    if (validate(currentStep)) {
      setIsSubmitting(true)
      setError(null)
      setShowSuccess(false)

      // Create Google Maps links
      const pickupGoogleMapsLink = `https://www.google.com/maps?q=${positionRamassage.latitude},${positionRamassage.longitude}`
      const deliveryGoogleMapsLink = `https://www.google.com/maps?q=${positionLivraison.latitude},${positionLivraison.longitude}`

      // Create message content with order details (HTML format for email)
      const message = `
        Order Details:<br><br>
        
        <strong>Personal Information:</strong><br>
        - Full Name: ${allFormData.fullName}<br>
        - Phone: ${allFormData.phoneNumber}<br><br>
        
        <strong>Pickup Details:</strong><br>
        - Address: ${allFormData.pickupAddress}<br>
        - Date: ${allFormData.pickupDate}<br>
        - Time: ${allFormData.pickupTime}<br>
        - Location Coordinates: ${positionRamassage.latitude}, ${positionRamassage.longitude}<br>
        - Google Maps: <a href="${pickupGoogleMapsLink}" target="_blank">Open Pickup Location in Google Maps</a><br><br>
        
        <strong>Delivery Details:</strong><br>
        - Address: ${allFormData.deliveryAddress}<br>
        - Date: ${allFormData.deliveryDate}<br>
        - Time: ${allFormData.deliveryTime}<br>
        - Location Coordinates: ${positionLivraison.latitude}, ${positionLivraison.longitude}<br>
        - Google Maps: <a href="${deliveryGoogleMapsLink}" target="_blank">Open Delivery Location in Google Maps</a>
      `.trim()

      sendEmail({
        name: allFormData.fullName,
        phone: allFormData.phoneNumber,
        email: '', // Add email field if needed
        address: `${allFormData.pickupAddress} → ${allFormData.deliveryAddress}`,
        subject: `New Order from ${allFormData.fullName}`,
        message: message
      }).then(async () => {
        setIsSubmitting(false)          
        setShowSuccess(true)
        setError(null)

        const res =  await API.post("/ramassages", {
          laundry_id: laundryId,  
          fullName: allFormData.fullName,
          phoneNumber: allFormData.phoneNumber,
          pickupAddress: allFormData.pickupAddress,
          pickupDate: allFormData.pickupDate,
          pickupTime: allFormData.pickupTime,
          pickupLatitude: positionRamassage.latitude,
          pickupLongitude: positionRamassage.longitude,
          deliveryAddress: allFormData.deliveryAddress,
          deliveryDate: allFormData.deliveryDate,
          deliveryTime: allFormData.deliveryTime,
          deliveryLatitude: positionLivraison.latitude,
          deliveryLongitude: positionLivraison.longitude,
          services: selectedServices[0]
        })


        // Clear checkout data from localStorage
        localStorage.removeItem('checkoutServices')
        localStorage.removeItem('checkoutLaundryId')
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false)
          navigate('/')
        }, 5000)

         // Redirect to home or another page after successful submission

        
        
        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(allFormData)
        }
      }).catch((error) => {
        console.error('Error sending email:', error)
        setIsSubmitting(false)
        setError('There was an error submitting your order. Please try again.')
        setShowSuccess(false)
      })
    }
  }

  const renderProgressSteps = () => {
    return (
      <div className="flex items-center gap-4">
        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            currentStep > 1 
              ? 'bg-[#0EA5C9] text-white' 
              : currentStep === 1 
              ? 'bg-[#0EA5C9] text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            {currentStep > 1 ? <Icon icon={FaCheck} theme="light" size="sm" /> : '1'}
          </div>
          <span className="text-sm text-[#62707D]">Informations personnelles</span>
        </div>
        <div className={`flex-1 h-0.5 ${currentStep > 1 ? 'bg-[#0EA5C9]' : 'bg-gray-300'}`}></div>
        
        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            currentStep > 2 
              ? 'bg-[#0EA5C9] text-white' 
              : currentStep === 2 
              ? 'bg-[#0EA5C9] text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            {currentStep > 2 ? <Icon icon={FaCheck} theme="light" size="sm" /> : '2'}
          </div>
          <span className="text-sm text-[#62707D]">Ramassage</span>
        </div>
        <div className={`flex-1 h-0.5 ${currentStep > 2 ? 'bg-[#0EA5C9]' : 'bg-gray-300'}`}></div>
        
        {/* Step 3 */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            currentStep === 3 
              ? 'bg-[#0EA5C9] text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
          <span className="text-sm text-[#62707D]">Livraison</span>
        </div>
      </div>
    )
  }

  const renderOrderSummary = () => {
    return (
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
          <h2 className="text-xl font-bold text-[#022545] mb-4">Résumé de la commande</h2>
          
          {/* Delivery Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon icon={FaCheck} theme="accent" size="md" className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-700 mb-1">{orderSummary.deliveryInfo.title}</p>
                <p className="text-sm text-green-600">{orderSummary.deliveryInfo.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-gradient-to-r from-[#1BB38C] to-[#0EA5C9] text-white p-5 rounded-xl shadow-lg flex items-center gap-4"
            >
              <FaCheckCircle className="w-7 h-7 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-xl mb-1">Order Submitted Successfully!</h4>
                <p className="text-sm text-white/90">Your order has been received. We'll process it and contact you soon.</p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-red-500 text-white p-5 rounded-xl shadow-lg flex items-center gap-4"
            >
              <FaTimes className="w-7 h-7 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-xl mb-1">Error</h4>
                <p className="text-sm text-white/90">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-[#0EA5C9] mb-4 hover:underline">
                <Icon icon={FaArrowLeft} theme="primary" size="sm" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-[#022545] mb-6">Checkout</h1>
              {renderProgressSteps()}
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#022545] mb-6">Informations personnelles</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-[#022545] mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={allFormData.fullName}
                      onChange={handleStep1Change}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#022545] mb-2">
                      Numéro de téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={allFormData.phoneNumber}
                      onChange={handleStep1Change}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={allFormData.saveInfo}
                      onChange={handleStep1Change}
                      className="w-5 h-5 text-[#0EA5C9] border-gray-300 rounded focus:ring-[#0EA5C9]"
                    />
                    <label htmlFor="saveInfo" className="text-sm text-[#62707D]">
                      Enregistrer mes informations pour la prochaine fois
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleNext} className="w-full">
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pickup Details */}
            {currentStep === 2 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-bold text-[#022545] mb-6">Détails de ramassage</h2>
                
                {laundry?.openingHours && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Horaires de la pressing :</span> {laundry.openingHours}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon={FaMapMarkerAlt} theme="primary" size="md" />
                    <h3 className="font-bold text-[#022545]">Adresse de Ramassage</h3>
                  </div>
                  <p className="text-sm text-[#62707D] mb-3">Saisir l'adresse de ramassage manuellement</p>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={allFormData.pickupAddress}
                    onChange={handleStep2Change}
                    placeholder="Votre adresse complète"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent mb-4"
                  />
                  
                 
                </div>

                <div>
                 
                  <LocationForm
                    setPosition={setPositionRamassage}
                    position={positionRamassage}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#022545] mb-2">
                      Date de Ramassage
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="pickupDate"
                        value={allFormData.pickupDate}
                        min={getTodayStr()}
                        onChange={(e) => {
                          const val = e.target.value
                          handleStep2Change(e)
                          setErros(prev => ({ ...prev, pickupDate: null }))
                          if (val && !isNotPastDate(val)) {
                            setErros(prev => ({ ...prev, pickupDate: "La date ne peut pas être dans le passé" }))
                          } else if (val && !isWorkingDay(val)) {
                            const d = new Date(val + 'T00:00:00')
                            setErros(prev => ({ ...prev, pickupDate: `La pressing ne travaille pas le ${getDayName(d.getDay())}` }))
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent ${errors.pickupDate ? 'border-red-400' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.pickupDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaInfoCircle className="flex-shrink-0" /> {errors.pickupDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#022545] mb-2">
                      Heure de Ramassage
                    </label>
                    <select
                      name="pickupTime"
                      value={allFormData.pickupTime}
                      onChange={handleStep2Change}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                    >
                      <option value="">Sélectionner --</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={handleNext} className="flex-1">
                    Suivant
                  </Button>
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-200 text-[#022545] rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <Icon icon={FaArrowLeft} theme="dark" size="sm" />
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Delivery Details */}
            {currentStep === 3 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-bold text-[#022545] mb-6">Détails de livraison</h2>
                
                {laundry?.openingHours && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Horaires de la pressing :</span> {laundry.openingHours}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon={FaMapMarkerAlt} theme="primary" size="md" />
                    <h3 className="font-bold text-[#022545]">Adresse de Livraison</h3>
                  </div>
                  <p className="text-sm text-[#62707D] mb-3">Saisir l'adresse de livraison manuellement</p>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={allFormData.deliveryAddress}
                    onChange={handleStep3Change}
                    placeholder="Votre adresse complète"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent mb-4"
                  />
                  
                
                </div>

                <div>
                  <LocationForm
                     position={positionLivraison}
                     setPosition={setPositionLivraison}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#022545] mb-2">
                      Date de Livraison
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="deliveryDate"
                        value={allFormData.deliveryDate}
                        min={allFormData.pickupDate || getTodayStr()}
                        onChange={(e) => {
                          const val = e.target.value
                          handleStep3Change(e)
                          setErros(prev => ({ ...prev, deliveryDate: null }))
                          if (val && !isNotPastDate(val)) {
                            setErros(prev => ({ ...prev, deliveryDate: "La date ne peut pas être dans le passé" }))
                          } else if (val && !isWorkingDay(val)) {
                            const d = new Date(val + 'T00:00:00')
                            setErros(prev => ({ ...prev, deliveryDate: `La pressing ne travaille pas le ${getDayName(d.getDay())}` }))
                          } else if (val && !isDeliveryAfterPickup(val)) {
                            setErros(prev => ({ ...prev, deliveryDate: "La date de livraison doit être après la date de ramassage" }))
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent ${errors.deliveryDate ? 'border-red-400' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.deliveryDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaInfoCircle className="flex-shrink-0" /> {errors.deliveryDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#022545] mb-2">
                      Heure de Livraison
                    </label>
                    <select
                      name="deliveryTime"
                      value={allFormData.deliveryTime}
                      onChange={handleStep3Change}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleFinalSubmit} 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Passer la commande'
                    )}
                  </Button>
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gray-200 text-[#022545] rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon={FaArrowLeft} theme="dark" size="sm" />
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  )
}

export default Checkout

