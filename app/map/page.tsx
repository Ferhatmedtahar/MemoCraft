"use client";

import {
  Camera,
  Filter,
  Hotel,
  Info,
  MapPin,
  Navigation,
  UtensilsCrossed,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

// Dynamically import map component to avoid SSR issues

// Mock data for locations
const mockLocations = {
  restaurants: [
    {
      id: 1,
      name: "Local Bistro",
      lat: 36.7538,
      lng: 3.0588,
      type: "restaurant",
      rating: 4.5,
      cuisine: "Mediterranean",
    },
    {
      id: 2,
      name: "Street Food Corner",
      lat: 36.7628,
      lng: 3.0428,
      type: "restaurant",
      rating: 4.2,
      cuisine: "Local",
    },
    {
      id: 3,
      name: "Fine Dining",
      lat: 36.7438,
      lng: 3.0688,
      type: "restaurant",
      rating: 4.8,
      cuisine: "International",
    },
  ],
  hotels: [
    {
      id: 4,
      name: "Grand Hotel",
      lat: 36.7588,
      lng: 3.0488,
      type: "hotel",
      rating: 4.7,
      stars: 5,
    },
    {
      id: 5,
      name: "Budget Stay",
      lat: 36.7488,
      lng: 3.0588,
      type: "hotel",
      rating: 4.1,
      stars: 3,
    },
    {
      id: 6,
      name: "Boutique Hotel",
      lat: 36.7688,
      lng: 3.0388,
      type: "hotel",
      rating: 4.6,
      stars: 4,
    },
  ],
  attractions: [
    {
      id: 7,
      name: "Historic Monument",
      lat: 36.7638,
      lng: 3.0538,
      type: "attraction",
      rating: 4.9,
      category: "Historical",
    },
    {
      id: 8,
      name: "City Park",
      lat: 36.7388,
      lng: 3.0638,
      type: "attraction",
      rating: 4.4,
      category: "Nature",
    },
    {
      id: 9,
      name: "Cultural Center",
      lat: 36.7538,
      lng: 3.0438,
      type: "attraction",
      rating: 4.3,
      category: "Cultural",
    },
  ],
};

// Mock country data
const countryData = {
  name: "Algeria",
  flag: "🇩🇿",
  capital: "Algiers",
  population: "44.9 million",
  currency: "Algerian Dinar (DZD)",
  language: "Arabic, Berber",
  timezone: "CET (UTC+1)",
};

function MapPage() {
  const DynamicMap = useMemo(
    () =>
      dynamic(() => import("@/modules/map/Map"), {
        loading: () => (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Navigation className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  const [userLocation, setUserLocation] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    restaurants: true,
    hotels: true,
    attractions: true,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        () => {
          // Fallback to Algiers coordinates
          setUserLocation({ lat: 36.7538, lng: 3.0588 });
          setIsLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: 36.7538, lng: 3.0588 });
      setIsLoading(false);
    }
  }, []);

  const toggleFilter = (type) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getFilteredLocations = () => {
    let filtered = [];
    if (selectedFilters.restaurants)
      filtered.push(...mockLocations.restaurants);
    if (selectedFilters.hotels) filtered.push(...mockLocations.hotels);
    if (selectedFilters.attractions)
      filtered.push(...mockLocations.attractions);
    return filtered;
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case "restaurant":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "hotel":
        return <Hotel className="w-4 h-4" />;
      case "attraction":
        return <Camera className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getLocationColor = (type) => {
    switch (type) {
      case "restaurant":
        return "bg-orange-500";
      case "hotel":
        return "bg-blue-500";
      case "attraction":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleCountryClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/country/info";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Explorer Map</h1>
            </div>

            <button
              onClick={handleCountryClick}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <span className="text-2xl">{countryData.flag}</span>
              <span className="font-medium">{countryData.name}</span>
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar with filters */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>

            {/* Filter buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => toggleFilter("restaurants")}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedFilters.restaurants
                    ? "bg-orange-50 border-orange-200 text-orange-800"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <UtensilsCrossed className="w-5 h-5 mr-3" />
                  <span className="font-medium">Restaurants</span>
                </div>
                <span className="text-sm bg-white px-2 py-1 rounded-full">
                  {mockLocations.restaurants.length}
                </span>
              </button>

              <button
                onClick={() => toggleFilter("hotels")}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedFilters.hotels
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <Hotel className="w-5 h-5 mr-3" />
                  <span className="font-medium">Hotels</span>
                </div>
                <span className="text-sm bg-white px-2 py-1 rounded-full">
                  {mockLocations.hotels.length}
                </span>
              </button>

              <button
                onClick={() => toggleFilter("attractions")}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedFilters.attractions
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <Camera className="w-5 h-5 mr-3" />
                  <span className="font-medium">Attractions</span>
                </div>
                <span className="text-sm bg-white px-2 py-1 rounded-full">
                  {mockLocations.attractions.length}
                </span>
              </button>
            </div>

            {/* Location list */}
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              Nearby Places
            </h3>
            <div className="space-y-2">
              {getFilteredLocations().map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedLocation?.id === location.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-full text-white mr-3 ${getLocationColor(
                          location.type
                        )}`}
                      >
                        {getLocationIcon(location.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {location.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {location.cuisine ||
                            location.category ||
                            `${location.stars} stars`}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {location.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map area */}
        <div className="flex-1 relative">
          <DynamicMap
            userLocation={userLocation}
            locations={getFilteredLocations()}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />

          {/* Map header overlay */}
          <div className="absolute top-4 left-4 right-4 z-[1000]">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Navigation className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">
                  {countryData.capital}, {countryData.name}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {getFilteredLocations().length} places shown
              </div>
            </div>
          </div>

          {/* Selected location info */}
          {selectedLocation && (
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg shadow-xl p-6 z-[1000]">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-full text-white mr-4 ${getLocationColor(
                      selectedLocation.type
                    )}`}
                  >
                    {getLocationIcon(selectedLocation.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {selectedLocation.cuisine ||
                        selectedLocation.category ||
                        `${selectedLocation.stars} star hotel`}
                    </p>
                    <div className="flex items-center mb-4">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="text-gray-700 ml-1 font-medium">
                        {selectedLocation.rating}
                      </span>
                      <span className="text-gray-500 ml-1">rating</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <div className="flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Get Directions
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                  More Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapPage;
// "use client";

// import {
//   Camera,
//   Filter,
//   Hotel,
//   Info,
//   MapPin,
//   Navigation,
//   UtensilsCrossed,
// } from "lucide-react";
// import dynamic from "next/dynamic";
// import { useEffect, useMemo, useRef, useState } from "react";

// // Dynamically import map component to avoid SSR issues
// // const DynamicMap = dynamic(() => import("./MapComponent"), {
// //   ssr: false,
// //   loading: () => (
// //     <div className="flex items-center justify-center h-full">
// //       <div className="text-center">
// //         <Navigation className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
// //         <p className="text-gray-600">Loading map...</p>
// //       </div>
// //     </div>
// //   ),
// // });
// const DynamicMap = useMemo(
//   () =>
//     dynamic(() => import("@/modules/map/Map"), {
//       loading: () => <p>A map is loading</p>,
//       ssr: false,
//     }),
//   []
// );

// // Mock data for locations
// const mockLocations = {
//   restaurants: [
//     {
//       id: 1,
//       name: "Local Bistro",
//       lat: 36.7538,
//       lng: 3.0588,
//       type: "restaurant",
//       rating: 4.5,
//       cuisine: "Mediterranean",
//     },
//     {
//       id: 2,
//       name: "Street Food Corner",
//       lat: 36.7628,
//       lng: 3.0428,
//       type: "restaurant",
//       rating: 4.2,
//       cuisine: "Local",
//     },
//     {
//       id: 3,
//       name: "Fine Dining",
//       lat: 36.7438,
//       lng: 3.0688,
//       type: "restaurant",
//       rating: 4.8,
//       cuisine: "International",
//     },
//   ],
//   hotels: [
//     {
//       id: 4,
//       name: "Grand Hotel",
//       lat: 36.7588,
//       lng: 3.0488,
//       type: "hotel",
//       rating: 4.7,
//       stars: 5,
//     },
//     {
//       id: 5,
//       name: "Budget Stay",
//       lat: 36.7488,
//       lng: 3.0588,
//       type: "hotel",
//       rating: 4.1,
//       stars: 3,
//     },
//     {
//       id: 6,
//       name: "Boutique Hotel",
//       lat: 36.7688,
//       lng: 3.0388,
//       type: "hotel",
//       rating: 4.6,
//       stars: 4,
//     },
//   ],
//   attractions: [
//     {
//       id: 7,
//       name: "Historic Monument",
//       lat: 36.7638,
//       lng: 3.0538,
//       type: "attraction",
//       rating: 4.9,
//       category: "Historical",
//     },
//     {
//       id: 8,
//       name: "City Park",
//       lat: 36.7388,
//       lng: 3.0638,
//       type: "attraction",
//       rating: 4.4,
//       category: "Nature",
//     },
//     {
//       id: 9,
//       name: "Cultural Center",
//       lat: 36.7538,
//       lng: 3.0438,
//       type: "attraction",
//       rating: 4.3,
//       category: "Cultural",
//     },
//   ],
// };

// // Mock country data
// const countryData = {
//   name: "Algeria",
//   flag: "🇩🇿",
//   capital: "Algiers",
//   population: "44.9 million",
//   currency: "Algerian Dinar (DZD)",
//   language: "Arabic, Berber",
//   timezone: "CET (UTC+1)",
// };

// function MapPage() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [selectedFilters, setSelectedFilters] = useState({
//     restaurants: true,
//     hotels: true,
//     attractions: true,
//   });
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Get user's location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//           setIsLoading(false);
//         },
//         () => {
//           // Fallback to Algiers coordinates
//           setUserLocation({ lat: 36.7538, lng: 3.0588 });
//           setIsLoading(false);
//         }
//       );
//     } else {
//       setUserLocation({ lat: 36.7538, lng: 3.0588 });
//       setIsLoading(false);
//     }
//   }, []);

//   const toggleFilter = (type) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [type]: !prev[type],
//     }));
//   };

//   const getFilteredLocations = () => {
//     let filtered = [];
//     if (selectedFilters.restaurants)
//       filtered.push(...mockLocations.restaurants);
//     if (selectedFilters.hotels) filtered.push(...mockLocations.hotels);
//     if (selectedFilters.attractions)
//       filtered.push(...mockLocations.attractions);
//     return filtered;
//   };

//   const getLocationIcon = (type) => {
//     switch (type) {
//       case "restaurant":
//         return <UtensilsCrossed className="w-4 h-4" />;
//       case "hotel":
//         return <Hotel className="w-4 h-4" />;
//       case "attraction":
//         return <Camera className="w-4 h-4" />;
//       default:
//         return <MapPin className="w-4 h-4" />;
//     }
//   };

//   const getLocationColor = (type) => {
//     switch (type) {
//       case "restaurant":
//         return "bg-orange-500";
//       case "hotel":
//         return "bg-blue-500";
//       case "attraction":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const handleCountryClick = () => {
//     if (typeof window !== "undefined") {
//       window.location.href = "/country/info";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Navigation className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
//           <p className="text-gray-600">Loading map...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <nav className="bg-white shadow-lg border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <h1 className="text-xl font-bold text-gray-900">Explorer Map</h1>
//             </div>

//             <button
//               onClick={handleCountryClick}
//               className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               <span className="text-2xl">{countryData.flag}</span>
//               <span className="font-medium">{countryData.name}</span>
//               <Info className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="flex h-[calc(100vh-4rem)]">
//         {/* Sidebar with filters */}
//         <div className="w-80 bg-white shadow-lg overflow-y-auto">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//               <Filter className="w-5 h-5 mr-2" />
//               Filters
//             </h2>

//             {/* Filter buttons */}
//             <div className="space-y-3 mb-6">
//               <button
//                 onClick={() => toggleFilter("restaurants")}
//                 className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
//                   selectedFilters.restaurants
//                     ? "bg-orange-50 border-orange-200 text-orange-800"
//                     : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <UtensilsCrossed className="w-5 h-5 mr-3" />
//                   <span className="font-medium">Restaurants</span>
//                 </div>
//                 <span className="text-sm bg-white px-2 py-1 rounded-full">
//                   {mockLocations.restaurants.length}
//                 </span>
//               </button>

//               <button
//                 onClick={() => toggleFilter("hotels")}
//                 className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
//                   selectedFilters.hotels
//                     ? "bg-blue-50 border-blue-200 text-blue-800"
//                     : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <Hotel className="w-5 h-5 mr-3" />
//                   <span className="font-medium">Hotels</span>
//                 </div>
//                 <span className="text-sm bg-white px-2 py-1 rounded-full">
//                   {mockLocations.hotels.length}
//                 </span>
//               </button>

//               <button
//                 onClick={() => toggleFilter("attractions")}
//                 className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
//                   selectedFilters.attractions
//                     ? "bg-green-50 border-green-200 text-green-800"
//                     : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <Camera className="w-5 h-5 mr-3" />
//                   <span className="font-medium">Attractions</span>
//                 </div>
//                 <span className="text-sm bg-white px-2 py-1 rounded-full">
//                   {mockLocations.attractions.length}
//                 </span>
//               </button>
//             </div>

//             {/* Location list */}
//             <h3 className="text-md font-semibold text-gray-900 mb-3">
//               Nearby Places
//             </h3>
//             <div className="space-y-2">
//               {getFilteredLocations().map((location) => (
//                 <div
//                   key={location.id}
//                   onClick={() => setSelectedLocation(location)}
//                   className={`p-3 rounded-lg border cursor-pointer transition-colors ${
//                     selectedLocation?.id === location.id
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start">
//                       <div
//                         className={`p-2 rounded-full text-white mr-3 ${getLocationColor(
//                           location.type
//                         )}`}
//                       >
//                         {getLocationIcon(location.type)}
//                       </div>
//                       <div>
//                         <h4 className="font-medium text-gray-900">
//                           {location.name}
//                         </h4>
//                         <p className="text-sm text-gray-600">
//                           {location.cuisine ||
//                             location.category ||
//                             `${location.stars} stars`}
//                         </p>
//                         <div className="flex items-center mt-1">
//                           <span className="text-yellow-500">★</span>
//                           <span className="text-sm text-gray-600 ml-1">
//                             {location.rating}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Map area */}
//         <div className="flex-1 relative">
//           <DynamicMap
//             userLocation={userLocation}
//             locations={getFilteredLocations()}
//             selectedLocation={selectedLocation}
//             onLocationSelect={setSelectedLocation}
//           />

//           {/* Map header overlay */}
//           <div className="absolute top-4 left-4 right-4 z-[1000]">
//             <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
//               <div className="flex items-center">
//                 <Navigation className="w-5 h-5 text-blue-600 mr-2" />
//                 <span className="font-medium text-gray-900">
//                   {countryData.capital}, {countryData.name}
//                 </span>
//               </div>
//               <div className="text-sm text-gray-600">
//                 {getFilteredLocations().length} places shown
//               </div>
//             </div>
//           </div>

//           {/* Selected location info */}
//           {selectedLocation && (
//             <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg shadow-xl p-6 z-[1000]">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start">
//                   <div
//                     className={`p-3 rounded-full text-white mr-4 ${getLocationColor(
//                       selectedLocation.type
//                     )}`}
//                   >
//                     {getLocationIcon(selectedLocation.type)}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">
//                       {selectedLocation.name}
//                     </h3>
//                     <p className="text-gray-600 mb-2">
//                       {selectedLocation.cuisine ||
//                         selectedLocation.category ||
//                         `${selectedLocation.stars} star hotel`}
//                     </p>
//                     <div className="flex items-center mb-4">
//                       <span className="text-yellow-500 text-lg">★</span>
//                       <span className="text-gray-700 ml-1 font-medium">
//                         {selectedLocation.rating}
//                       </span>
//                       <span className="text-gray-500 ml-1">rating</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedLocation(null)}
//                   className="text-gray-400 hover:text-gray-600 text-xl"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="flex space-x-3">
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
//                   Get Directions
//                 </button>
//                 <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
//                   More Info
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // MapComponent - Separate component for Leaflet map
// function MapComponent({
//   userLocation,
//   locations,
//   selectedLocation,
//   onLocationSelect,
// }) {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markersRef = useRef([]);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const initializeMap = async () => {
//       // Dynamic imports for Leaflet
//       const L = (await import("leaflet")).default;

//       // Import Leaflet CSS
//       await import("leaflet/dist/leaflet.css");

//       // Fix for default markers in webpack
//       delete L.Icon.Default.prototype._getIconUrl;
//       L.Icon.Default.mergeOptions({
//         iconRetinaUrl:
//           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//         iconUrl:
//           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//         shadowUrl:
//           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//       });

//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//       }

//       // Initialize map
//       const map = L.map(mapRef.current).setView(
//         [userLocation.lat, userLocation.lng],
//         13
//       );

//       // Add OpenStreetMap tiles
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution:
//           '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       // Add user location marker
//       const userIcon = L.divIcon({
//         html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
//         iconSize: [16, 16],
//         className: "custom-user-marker",
//       });

//       L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
//         .addTo(map)
//         .bindPopup("Your Location");

//       mapInstanceRef.current = map;
//     };

//     if (userLocation) {
//       initializeMap();
//     }

//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, [userLocation]);

//   // Update markers when locations or filters change
//   useEffect(() => {
//     if (!mapInstanceRef.current || typeof window === "undefined") return;

//     const updateMarkers = async () => {
//       const L = (await import("leaflet")).default;

//       // Clear existing markers
//       markersRef.current.forEach((marker) => {
//         mapInstanceRef.current.removeLayer(marker);
//       });
//       markersRef.current = [];

//       // Add new markers
//       locations.forEach((location) => {
//         const getMarkerColor = (type) => {
//           switch (type) {
//             case "restaurant":
//               return "#f97316"; // orange-500
//             case "hotel":
//               return "#3b82f6"; // blue-500
//             case "attraction":
//               return "#22c55e"; // green-500
//             default:
//               return "#6b7280"; // gray-500
//           }
//         };

//         const getMarkerIcon = (type) => {
//           switch (type) {
//             case "restaurant":
//               return "🍴";
//             case "hotel":
//               return "🏨";
//             case "attraction":
//               return "📷";
//             default:
//               return "📍";
//           }
//         };

//         const isSelected = selectedLocation?.id === location.id;
//         const color = getMarkerColor(location.type);
//         const icon = getMarkerIcon(location.type);
//         const size = isSelected ? 40 : 32;

//         const customIcon = L.divIcon({
//           html: `
//             <div style="
//               background-color: ${color};
//               width: ${size}px;
//               height: ${size}px;
//               border-radius: 50%;
//               border: 3px solid white;
//               box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               font-size: ${size * 0.4}px;
//               ${isSelected ? "transform: scale(1.1); z-index: 1000;" : ""}
//             ">
//               ${icon}
//             </div>
//           `,
//           iconSize: [size, size],
//           className: "custom-location-marker",
//         });

//         const marker = L.marker([location.lat, location.lng], {
//           icon: customIcon,
//         })
//           .addTo(mapInstanceRef.current)
//           .on("click", () => {
//             onLocationSelect(location);
//           });

//         // Add popup
//         const popupContent = `
//           <div style="min-width: 200px;">
//             <h3 style="margin: 0 0 8px 0; font-weight: bold;">${
//               location.name
//             }</h3>
//             <p style="margin: 0 0 4px 0; color: #666;">
//               ${
//                 location.cuisine ||
//                 location.category ||
//                 `${location.stars} star hotel`
//               }
//             </p>
//             <div style="display: flex; align-items: center;">
//               <span style="color: #fbbf24;">★</span>
//               <span style="margin-left: 4px; font-weight: 500;">${
//                 location.rating
//               }</span>
//             </div>
//           </div>
//         `;

//         marker.bindPopup(popupContent);

//         markersRef.current.push(marker);
//       });
//     };

//     updateMarkers();
//   }, [locations, selectedLocation, onLocationSelect]);

//   // Pan to selected location
//   useEffect(() => {
//     if (selectedLocation && mapInstanceRef.current) {
//       mapInstanceRef.current.setView(
//         [selectedLocation.lat, selectedLocation.lng],
//         15,
//         {
//           animate: true,
//           duration: 0.5,
//         }
//       );
//     }
//   }, [selectedLocation]);

//   return <div ref={mapRef} className="w-full h-full" />;
// }

// export default MapPage;
