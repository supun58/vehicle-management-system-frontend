import { useEffect, useRef, useState } from "react";

const LocationPickerModal = ({ onClose, onSelectLocation, initialLocation}) => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mode, setMode] = useState(""); // "", "current", "search", "click"

useEffect(() => {
  if (searchInputRef.current) {
    const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setSearchLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.formatted_address || place.name,
        });
        setSelectedMethod('search');
      }
    });
  }
}, []);

  
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("click", (e) => {
      if (mode !== "click") return;

      const loc = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      if (marker) marker.setMap(null);

      const newMarker = new window.google.maps.Marker({
        position: loc,
        map: map,
      });

      setMarker(newMarker);
      setSelectedLocation({ ...loc, address: "Selected on map" });
    });

    return () => window.google.maps.event.removeListener(listener);
  }, [map, mode, marker]);

  useEffect(() => {
    if (!map || !initialLocation || !window.google) return;
  
    // Remove old marker if any
    if (marker) {
      marker.setMap(null);
    }
  
    const loc = new window.google.maps.LatLng(initialLocation.lat, initialLocation.lng);
  
    const newMarker = new window.google.maps.Marker({
      position: loc,
      map: map,
      title: initialLocation.address || initialLocation.name || "Selected Location",
    });
  
    setMarker(newMarker);
    setSelectedLocation({
      lat: initialLocation.lat,
      lng: initialLocation.lng,
      address: initialLocation.address || initialLocation.name || "",
    });
  
    map.setCenter(loc);
    map.setZoom(15);
  
    // Fill search input with address
    if (searchInputRef.current) {
      searchInputRef.current.value = initialLocation.address || initialLocation.name || '';
    }
  
  }, [initialLocation, map]);
  
  useEffect(() => {
    if (!window.google) return;

    const initialCenter = { lat: 6.9271, lng: 79.8612 }; // Default center
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 13,
    });

    setMap(mapInstance);


    if (navigator.geolocation && !selectedLocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("Accuracy in meters:", pos.coords.accuracy); 
            
                const loc = {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                };
          
              // Use this accurate location
              const blueDot = new window.google.maps.Marker({
                position: loc,
                map: mapInstance,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "white",
                  strokeWeight: 2,
                },
                title: "Current Location",
              });
          
              mapInstance.setCenter(loc);
              mapInstance.setZoom(17); // More zoom to show it's precise
          
              if (mode === "current") {
                setSelectedLocation({
                  lat: loc.lat,
                  lng: loc.lng,
                  address: "Current Location",
                  method: "current",
                });
              }
            },
            (err) => {
              console.error("Geolocation error:", err);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }          

    const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
    autocomplete.bindTo("bounds", mapInstance);

    autocomplete.addListener("place_changed", () => {
      if (mode !== "search") return;

      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const loc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      if (marker) marker.setMap(null);

      const newMarker = new window.google.maps.Marker({
        position: loc,
        map: mapInstance,
        title: place.name,
      });

      setMarker(newMarker);
      setSelectedLocation({
        lat: loc.lat,
        lng: loc.lng,
        address: place.formatted_address || place.name,
      });

      mapInstance.panTo(loc);
    });
  }, [mode]);



  const handleCancel = () => {
    onClose(); 
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation); // ✅ This function should be passed from parent
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-3">Select Location</h2>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode("current")} className={`px-3 py-1 rounded ${mode === "current" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Use Current Location</button>
          <button onClick={() => setMode("search")} className={`px-3 py-1 rounded ${mode === "search" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Search</button>
          <button onClick={() => setMode("click")} className={`px-3 py-1 rounded ${mode === "click" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Pick on Map</button>
        </div>

        {mode === "search" && (
          <input ref={searchInputRef} type="text" placeholder="Search for a place" className="w-full p-2 border rounded mb-4" />
        )}

        <div ref={mapRef} className="h-96 w-full border rounded"></div>

        <div className="flex justify-end mt-4 gap-2">
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={!selectedLocation} className={`px-4 py-2 rounded ${selectedLocation ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
