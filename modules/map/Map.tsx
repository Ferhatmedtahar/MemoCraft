// import "leaflet-defaulticon-compatibility";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// export default function MyMap(props: any) {
//   const { position, zoom } = props;

//   return (
//     <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker position={position}>
//         <Popup>
//           A pretty CSS3 popup. <br /> Easily customizable.
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// }
"use client";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Component to handle map updates when selected location changes
function MapUpdater({ selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 15, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedLocation, map]);

  return null;
}

// Custom marker icons
const createCustomIcon = (type: string, isSelected: boolean = false) => {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case "restaurant":
        return "#f97316"; // orange-500
      case "hotel":
        return "#3b82f6"; // blue-500
      case "attraction":
        return "#22c55e"; // green-500
      default:
        return "#6b7280"; // gray-500
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return "🍴";
      case "hotel":
        return "🏨";
      case "attraction":
        return "📷";
      default:
        return "📍";
    }
  };

  const color = getMarkerColor(type);
  const icon = getMarkerIcon(type);
  const size = isSelected ? 40 : 32;

  return divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.4}px;
        cursor: pointer;
        ${isSelected ? "transform: scale(1.1); z-index: 1000;" : ""}
      ">
        ${icon}
      </div>
    `,
    iconSize: [size, size],
    className: "custom-location-marker",
  });
};

// User location marker
const createUserIcon = () => {
  return divIcon({
    html: `
      <div style="
        background-color: #ef4444;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -2px;
          left: -2px;
          width: 12px;
          height: 12px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0.75;
        "></div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [16, 16],
    className: "custom-user-marker",
  });
};

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null;
  locations: any[];
  selectedLocation: any;
  onLocationSelect: (location: any) => void;
}

export default function MapComponent({
  userLocation,
  locations,
  selectedLocation,
  onLocationSelect,
}: MapComponentProps) {
  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading location...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={createUserIcon()}
        >
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
              <br />
              <span className="text-sm text-gray-600">
                Lat: {userLocation.lat.toFixed(4)}, Lng:{" "}
                {userLocation.lng.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>

        {/* Location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(
              location.type,
              selectedLocation?.id === location.id
            )}
            eventHandlers={{
              click: () => {
                onLocationSelect(location);
              },
            }}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                  {location.name}
                </h3>
                <p style={{ margin: "0 0 4px 0", color: "#666" }}>
                  {location.cuisine ||
                    location.category ||
                    `${location.stars} star hotel`}
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ color: "#fbbf24" }}>★</span>
                  <span style={{ marginLeft: "4px", fontWeight: "500" }}>
                    {location.rating}
                  </span>
                </div>
                <button
                  onClick={() => onLocationSelect(location)}
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Map updater component */}
        <MapUpdater selectedLocation={selectedLocation} />
      </MapContainer>
    </div>
  );
}
