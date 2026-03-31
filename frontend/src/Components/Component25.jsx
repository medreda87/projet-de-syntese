import React, { useState } from 'react'
import Icon from './ui/Icon'
import Button from './Button'
import { FaArrowLeft, FaCheck } from 'react-icons/fa'

const Component25 = ({
  currentStep = 1,
  onBack,
  onNext,
  formData = {
    fullName: "Imran",
    phoneNumber: "0687910242",
    saveInfo: true
  },
  orderSummary = {
    deliveryInfo: {
      title: "Livraison payante",
      message: "Si le prix du ramassage est supérieur à 100 DH, la livraison sera gratuite"
    }
  }
}) => {
  const [form, setForm] = useState(formData)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
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
                  <div className="w-8 h-8 rounded-full bg-[#0EA5C9] text-white flex items-center justify-center font-bold">
                    {currentStep > 1 ? <Icon icon={FaCheck} theme="light" size="sm" /> : '1'}
                  </div>
                  <span className="text-sm text-[#62707D]">Informations personnelles</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">2</div>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">3</div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#022545] mb-6">Informations personnelles</h2>
              
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#022545] mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#022545] mb-2">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-transparent"
                  />
                </div>

                {/* Save Info Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={form.saveInfo}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#0EA5C9] border-gray-300 rounded focus:ring-[#0EA5C9]"
                  />
                  <label htmlFor="saveInfo" className="text-sm text-[#62707D]">
                    Enregistrer mes informations pour la prochaine fois
                  </label>
                </div>

                {/* Next Button */}
                <div className="pt-4">
                  <Button onClick={() => onNext && onNext(form)} className="w-full">
                    Suivant
                  </Button>
                </div>
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

export default Component25

