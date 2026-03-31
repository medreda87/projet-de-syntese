import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { FaCheck, FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import Button from "./Button";
import Icon from "./ui/Icon";

// Fix Leaflet default icon for many bundlers
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Component to handle clicks on the map
const ClickHandler = ({ setPosition, setLocationSet }) => {
  useMapEvents({
    click(e) {
      setPosition((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
      setLocationSet(false);
    },
  });
  return null;
};

// Component to fly to marker when it changes
const FlyToMarker = ({ position, setLocationSet }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], map.getZoom(), {
        duration: 0.5,
      });
    }
  }, [position, map]);
  return null;
};

const LocationForm = ({ location, position, setPosition }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationSet, setLocationSet] = useState(false);


  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        setPosition((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      (err) => {
        console.error(err);
        if (err.code === 1) {
          setError(
            "Permission refusée. Veuillez autoriser la géolocalisation dans votre navigateur."
          );
        } else {
          setError("Impossible d'obtenir la position : " + err.message);
        }
      }
    );

    setLocationSet(true);
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-3">
        <div>
          <p className="text-gray-500 mb-2 text-base">
            Utiliser votre position actuelle en cliquant sur le bouton
          </p>
        </div>
        <Button
          onClick={handleGetLocation}
          icon={<Icon icon={FaMapMarkerAlt} theme="light" size="sm" />}
          disabled={loading && locationSet}
          className={`mb-6 w-full${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : locationSet
              ? "bg-green-600 hover:bg-green-700"
              : "bg-primary hover:bg-primary/55"
          }`}
        >
          {locationSet ? (
            <FaCheck className="w-5 h-5" />
          ) : (
            <FaMapMarkerAlt className="w-5 h-5" />
          )}
          {loading
            ? "Localisation en cours..."
            : locationSet
            ? "Position définie"
            : `En utilisant ma position actuelle`}
        </Button>
      </div>
      <div>
        <div>
          <p className="text-gray-500 mb-2 text-base">
            Choisir l’emplacement directement sur la carte en déplaçant le
            marqueur ou en cliquant
          </p>
        </div>
        <MapContainer
          center={[
            position?.latitude ?? 35.74804478729811,
            position?.longitude ?? -5.818333625793458,
          ]}
          zoom={15}
          style={{ height: "300px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fly map to marker on change */}
          {/* Fly map to marker on change */}
          <FlyToMarker position={position} setLocationSet={setLocationSet} />

          {/* Click on map to move marker */}
          <ClickHandler
            setPosition={setPosition}
            setLocationSet={setLocationSet}
          />
          {/* Draggable marker */}
          {position && (
            <Marker
              draggable={true}
              position={[
                position.latitude ?? 35.74804478729811,
                position.longitude ?? -5.818333625793458,
              ]}
              eventHandlers={{
                dragend: (e) => {
                  const latlng = e.target.getLatLng();
                  console.log(latlng);
                  setPosition({
                    ...position,
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                  });
                },
              }}
            >
              <Popup>Déplacez-moi ou cliquez sur la carte</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationForm;
