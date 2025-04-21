import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  Navigation,
  AlertTriangle,
  LocateFixed,
  Timer
} from 'lucide-react';
import axios from 'axios';
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places', 'geometry'];

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripStarted, setTripStarted] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('0.00');
  const [duration, setDuration] = useState(0);
  const [emergencyReported, setEmergencyReported] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [socket, setSocket] = useState(null);
  const mapRef = useRef(null);
  const timerRef = useRef(null);
  const routeCalculatedRef = useRef(false);
  const watchIdRef = useRef(null);


  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const getVehicleIcon = () => {
    if (!window.google || !window.google.maps) return null;
    return {
        path: "M -2,-1 L 2,-1 L 2,1 L -2,1 Z",
        fillColor: '#EA4335',
      fillOpacity: 1,
      scale: 8,
      strokeColor: 'white',
      strokeWeight: 2,
    };
  };

  const calculateRoute = useCallback((origin, destination, navigationMode = false) => {
    if (!window.google || !origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          const totalDistance = result.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000;
          const totalDuration = result.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60;
          setDistance(totalDistance.toFixed(2));
          setDuration(Math.round(totalDuration));
          routeCalculatedRef.current = true;

          if (navigationMode && mapRef.current) {
            mapRef.current.panTo(origin);
            mapRef.current.setZoom(17);
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/vehicle-request/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTask(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  useEffect(() => {
    if (!isLoaded || !task || routeCalculatedRef.current) return;
    
    const [fromLng, fromLat] = task.from.coordinates;
    const [toLng, toLat] = task.to.coordinates;
    calculateRoute({ lat: fromLat, lng: fromLng }, { lat: toLat, lng: toLng });
  }, [isLoaded, task, calculateRoute]);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!tripStarted) {
      // Cleanup if trip stops
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
  
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 30000
    };
  
    // Start interval to send location every 3 seconds
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const now = Date.now();
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || 0
          };
  
          setDriverLocation(newLocation);
  
          if (mapRef.current) {
            mapRef.current.panTo(newLocation);
          }
  
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'location_update',
              latitude: newLocation.lat,
              longitude: newLocation.lng,
              accuracy: newLocation.accuracy,
              heading: newLocation.heading,
              timestamp: now
            }));
          }
  
          if (task?.to?.coordinates) {
            const [toLng, toLat] = task.to.coordinates;
            calculateRoute(newLocation, { lat: toLat, lng: toLng }, true);
          }
        },
        (err) => {
          console.error('GPS error:', err);
          setError('Failed to get GPS location');
        },
        options
      );
    }, 1000); // Every 3 seconds
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tripStarted, task?.to?.coordinates, socket]);
  

  useEffect(() => {
    if (!tripStarted || !task?.AssignedDriver?.id) return;

    const ws = new WebSocket('wss://urban-space-fiesta-pjg55v44qp6gfr96v-5050.app.github.dev/ws/driver-tracking');

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: 'init',
        taskId: task._id,
        driverId: task.AssignedDriver.id
      }));
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'location_update') {
        const newPos = {
          lat: data.latitude,
          lng: data.longitude,
          accuracy: data.accuracy,
          heading: data.heading || 0
        };
        setDriverLocation(newPos);
      }
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket closed');

    return () => ws.close();
  }, [tripStarted, task?.AssignedDriver?.id, id]);

  useEffect(() => {
    if (!tripStarted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [tripStarted]);

  const handleStartTrip = () => {
    setTripStarted(true);
    setElapsedTime(0);
    setError(null);
  };

  const handleEndTrip = async () => {
    setTripStarted(false);
    try {
      await axios.patch(
        `https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/${id}/complete`,
        { tripDuration: elapsedTime, 
            distance: distance,
            driverLocation: driverLocation,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/driver-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete trip');
    }
  };

  const handleEmergency = () => {
    if (!socket || !driverLocation) return;
    socket.send(JSON.stringify({
      type: 'emergency',
      taskId: task._id,
      location: driverLocation
    }));
    setEmergencyReported(true);
    alert('Emergency reported! Help is on the way.');
  };

  const handleCenterMap = () => {
    if (driverLocation && mapRef.current) {
      mapRef.current.panTo(driverLocation);
      mapRef.current.setZoom(17);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const formatCoordinates = (location) => {
    if (!location?.coordinates) return 'Location not specified';
    const [longitude, latitude] = location.coordinates;
    return `${latitude?.toFixed(6) || 'N/A'}, ${longitude?.toFixed(6) || 'N/A'}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  if (error || loadError) return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] flex items-center justify-center">
      <div className="text-white text-xl">Error: {error || 'Failed to load Google Maps'}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28]">
      <div className="container mx-auto p-4 pt-20">
        <button onClick={() => navigate(-1)} className="flex items-center text-white mb-6">
          <ArrowLeft className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/90 rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-[#800000] mb-2">{task.purpose}</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {task.status}
                </span>
                <span className="text-gray-600">Task #{task._id}</span>
              </div>
            </div>

            <div className="bg-white/90 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#800000] mb-4">Requester Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="text-[#800000]" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{task.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-[#800000]" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{task.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-[#800000]" />
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium">{task.contact}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#800000] mb-4">Trip Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#800000]" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{new Date(task.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-[#800000]" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{task.newtime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#800000] mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-medium">{task.textfrom}</p>
                    <p className="text-sm text-blue-600">{formatCoordinates(task.from)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#800000] mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-medium">{task.textto}</p>
                    <p className="text-sm text-blue-600">{formatCoordinates(task.to)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Navigation className="text-[#800000]" />
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-medium">{distance} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-[#800000]" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Duration</p>
                    <p className="font-medium">{duration} minutes</p>
                  </div>
                </div>
                {tripStarted && (
                  <div className="flex items-center gap-3">
                    <Timer className="text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Trip Duration</p>
                      <p className="font-medium">{formatTime(elapsedTime)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!tripStarted ? (
              <div className="space-y-3">
                <button
                  onClick={handleStartTrip}
                  className="w-full bg-[#800000] hover:bg-[#600000] text-white py-3 rounded-xl font-bold"
                >
                  Start Trip
                </button>
                <div className="bg-[#800000]/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#800000] mb-2">Instructions:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Enable GPS before starting</li>
                    <li>• Keep app open during trip</li>
                    <li>• Report emergencies immediately</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleEndTrip}
                  className="w-full bg-[#800000] hover:bg-[#600000] text-white py-3 rounded-xl font-bold"
                >
                  End Trip
                </button>
                <button
                  onClick={handleEmergency}
                  disabled={emergencyReported}
                  className={`w-full py-3 rounded-xl font-bold ${
                    emergencyReported ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {emergencyReported ? 'Emergency Reported' : 'Report Emergency'}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {isLoaded ? (
              <div className="bg-white/90 rounded-xl shadow-lg p-4 h-full">
                <h2 className="text-xl font-semibold text-[#800000] mb-4">
                  {tripStarted ? 'Live Navigation' : 'Route Preview'}
                </h2>
                <div className="h-[600px] rounded-lg overflow-hidden relative">
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={driverLocation || (task?.from?.coordinates && {
                      lat: task.from.coordinates[1],
                      lng: task.from.coordinates[0]
                    }) || { lat: 0, lng: 0 }}
                    zoom={tripStarted ? 19 : 17}
                    onLoad={map => {
                        mapRef.current = map;
                        map.setZoom(17);
                      }}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                      streetViewControl: true,
                      fullscreenControl: true
                    }} 
                  >
                    {directions && <DirectionsRenderer 
                      directions={directions}
                      options={{
                        suppressMarkers: tripStarted,
                        preserveViewport: tripStarted,                       
                         polylineOptions: {
                          strokeColor: '#800000',
                          strokeOpacity: 0.8,
                          strokeWeight: 5
                        }
                      }}
                    />}
                    {tripStarted && driverLocation && (
                      <Marker 
                        position={driverLocation} 
                        icon={getVehicleIcon()}
                      />
                    )}
                  </GoogleMap>
                  <button
                    onClick={handleCenterMap}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg"
                  >
                    <LocateFixed className="text-[#800000]" />
                  </button>
                </div>
                {tripStarted && (
                  <div className="mt-4 p-4 bg-[#800000]/10 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm">Status</p>
                        <p className="font-bold">
                          {driverLocation?.accuracy < 30 ? (
                            <span className="flex items-center text-green-500">
                              <CheckCircle className="mr-1" /> Active Navigation
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-500">
                              <AlertTriangle className="mr-1" /> Low Accuracy
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">Accuracy</p>
                        <p className="font-bold">
                          {driverLocation?.accuracy?.toFixed(0) || '--'} meters
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">Distance</p>
                        <p className="font-bold">{distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm">ETA</p>
                        <p className="font-bold">{duration} min</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/90 rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="h-16 w-16 text-[#800000] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#800000]">Loading Map...</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;