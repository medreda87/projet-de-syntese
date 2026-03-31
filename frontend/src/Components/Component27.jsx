import React, { useState } from 'react'
import Icon from './ui/Icon'
import Button from './Button'
import { FaArrowLeft, FaCheck, FaMapMarkerAlt } from 'react-icons/fa'

const Component27 = ({
  currentStep = 3,
  onBack,
  onSubmit,
  formData = {
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: ""
  },
  orderSummary = {
    deliveryInfo: {
      title: "Livraison payante",
      message: "Si le prix du ramassage est supérieur à 100 DH, la livraison sera gratuite"
    }
  },
  onUseCurrentLocation,
  mapComponent = null
}) => {
  const [form, setForm] = useState(formData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  return (
    <div className="bg-white min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <button onClick={onBack} className="flex items-center gap-2 text-[#0EA5C9] mb-4 hover:underline">
                <Icon icon={FaArrowLeft} theme="primary" size="sm" />
                Retour
              </button>
              <h1 className="text-3xl font-bold text-[#022545] mb-6">Checkout</h1>

              {/* Progress Steps */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0EA5C9] text-white flex items-center justify-center">
                    <Icon icon={FaCheck} theme="light" size="sm" />
                  </div>
                  <span className="text-sm text-[#62707D]">Informations</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#0EA5C9]"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0EA5C9] text-white flex items-center justify-center">
                    <Icon icon={FaCheck} theme="light" size="sm" />
                  </div>
                  <span className="text-sm text-[#62707D]">Ramassage</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#0EA5C9]"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0EA5C9] text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="text-sm text-[#62707D]">Livraison</span>
                </div>
              </div>
            </div>

            {/* Delivery Details Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#022545] mb-6">Détails de livraison</h2>
              
              {/* Delivery Address */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon={FaMapMarkerAlt} theme="primary" size="md" />
                  <h3 className="font-bold text-[#022545]">Adresse de Livraison</h3>
                </div>
                <p className="text-sm text-[#62707D] mb-3">Saisir l'adresse de livraison manuellement</p>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Votre adresse complète"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent mb-4"
                />
                
                <p className="text-sm text-[#62707D] mb-3">Utiliser votre position actuelle en cliquant sur le bouton</p>
                <Button
                  onClick={onUseCurrentLocation}
                  icon={<Icon icon={FaMapMarkerAlt} theme="light" size="sm" />}
                  className="mb-6"
                >
                  En utilisant ma position actuelle
                </Button>
              </div>

              {/* Map Section */}
              <div>
                <p className="text-sm text-[#62707D] mb-3">
                  Choisir l'emplacement directement sur la carte en déplaçant le marqueur ou en cliquant
                </p>
                {mapComponent || (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                    <p className="text-gray-500">Map Component - Integrate your map library here</p>
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#022545] mb-2">
                    Date de Livraison
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="deliveryDate"
                      value={form.deliveryDate}
                      onChange={handleChange}
                      placeholder="mm/dd/yyyy"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                    />
                    <Icon icon={FaCheck} theme="primary" size="sm" className="absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#022545] mb-2">
                    Heure de Livraison
                  </label>
                  <select
                    name="deliveryTime"
                    value={form.deliveryTime}
                    onChange={handleChange}
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

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button onClick={() => onSubmit && onSubmit(form)} className="flex-1">
                  Passer la commande
                </Button>
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-200 text-[#022545] rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <Icon icon={FaArrowLeft} theme="dark" size="sm" />
                  Retour
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
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
        </div>
      </div>
    </div>
  )
}

export default Component27

