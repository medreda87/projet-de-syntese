import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IoLocationOutline } from 'react-icons/io5'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { MdOutlineVerified } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { STORAGE_URL } from '../utils/config'

// Fix Leaflet default icon
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return STORAGE_URL + path
}

// Component to detect map movement and report bounds
const BoundsWatcher = ({ onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds()
      onBoundsChange({
        sw_lat: bounds.getSouthWest().lat,
        sw_lng: bounds.getSouthWest().lng,
        ne_lat: bounds.getNorthEast().lat,
        ne_lng: bounds.getNorthEast().lng,
      })
    },
  })
  return null
}

const FlyToLocation = ({ focusLocation }) => {
  const map = useMap()

  React.useEffect(() => {
    if (!focusLocation?.lat || !focusLocation?.lng) return
    map.flyTo([focusLocation.lat, focusLocation.lng], 12, { duration: 1.2 })
  }, [focusLocation, map])

  return null
}

function ShopMap({ laundries, onBoundsChange, onClearFilter, mapBounds, loading, focusLocation }) {
  const navigate = useNavigate()
  const { setIdLaundry } = useAuth()

  const handleShopClick = (shop) => {
    setIdLaundry(shop.id)
    const title = shop.name.replace(/\s+/g, '_').toLowerCase()
    navigate(`/${title}?laundry_id=${shop.id}`)
  }

  // Default center: Morocco
  const defaultCenter = [33.5731, -7.5898]
  const defaultZoom = 6

  const laundriesWithCoords = laundries.filter(l => l.latitude && l.longitude)

  return (
    <div className='px-4 md:px-8 py-6'>
      {/* Info bar */}
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-2xl font-bold text-[#0F172A]'>
            Find on <span className='text-[#0C8CE9]'>Map</span>
          </h2>
          <p className='text-sm text-[#64748B] mt-1'>
            {loading ? 'Searching...' : `${laundries.length} shops in this area`}
            {laundriesWithCoords.length < laundries.length && !loading && (
              <span className='text-xs ml-2 text-amber-600'>
                ({laundries.length - laundriesWithCoords.length} without location)
              </span>
            )}
          </p>
        </div>
        {mapBounds && (
          <button
            onClick={onClearFilter}
            className='text-sm font-medium text-[#0C8CE9] hover:text-[#0C8CE9]/80 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0C8CE9]/20 hover:bg-sky-50'
          >
            <IoLocationOutline /> Reset Area
          </button>
        )}
      </div>

      {/* Map */}
      <div className='rounded-2xl overflow-hidden border border-gray-200 shadow-sm' style={{ height: '550px' }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsWatcher onBoundsChange={onBoundsChange} />
          <FlyToLocation focusLocation={focusLocation} />

          {focusLocation?.lat && focusLocation?.lng && (
            <CircleMarker
              center={[focusLocation.lat, focusLocation.lng]}
              radius={8}
              pathOptions={{ color: '#0C8CE9', fillColor: '#0C8CE9', fillOpacity: 0.8 }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}

          {laundriesWithCoords.map((shop) => (
            <Marker
              key={shop.id}
              position={[shop.latitude, shop.longitude]}
            >
              <Popup maxWidth={280} minWidth={220}>
                <div className='flex flex-col gap-2 p-1'>
                  {shop.logo && (
                    <img
                      src={getImageUrl(shop.logo)}
                      alt={shop.name}
                      className='w-full h-24 object-cover rounded-lg'
                    />
                  )}
                  <div className='flex items-center gap-1.5'>
                    <span className='font-bold text-sm text-[#0F172A]'>{shop.name}</span>
                    {shop.email_verified_at && (
                      <MdOutlineVerified className='text-[#0C8CE9] text-sm' />
                    )}
                  </div>
                  {shop.address && (
                    <p className='text-xs text-[#64748B] flex items-center gap-1'>
                      <IoLocationOutline /> {shop.address}
                    </p>
                  )}
                  {shop.comments_avg_rating && (
                    <div className='flex items-center gap-1 text-xs'>
                      <span className='text-yellow-500'>★</span>
                      <span className='font-semibold'>{Number(shop.comments_avg_rating).toFixed(1)}</span>
                      <span className='text-[#64748B]'>({shop.comments_count} reviews)</span>
                    </div>
                  )}
                  {shop.services && shop.services.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {shop.services.slice(0, 3).map((s, i) => (
                        <span key={i} className='text-[10px] font-medium text-[#0C8CE9] bg-sky-50 px-2 py-0.5 rounded'>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleShopClick(shop)}
                    className='mt-1 w-full text-center text-xs font-semibold text-white bg-[#0C8CE9] hover:bg-[#0C8CE9]/90 py-2 rounded-lg transition-colors'
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Shops without coords listed below */}
      {laundriesWithCoords.length === 0 && laundries.length > 0 && !loading && (
        <div className='mt-6 text-center py-10'>
          <FaMapMarkerAlt className='text-4xl text-gray-300 mx-auto mb-3' />
          <p className='text-[#64748B] text-sm'>No shops with location data in this area. Try zooming out or resetting the area.</p>
        </div>
      )}
    </div>
  )
}

export default ShopMap
