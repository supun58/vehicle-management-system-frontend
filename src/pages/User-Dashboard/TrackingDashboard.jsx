import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, Calendar, MapPin, User, Phone, Mail, 
  Navigation, LocateFixed, Timer, ArrowLeft,
  CheckCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places', 'geometry'];

const TrackingDashboard = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('0.00');
  const [duration, setDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [hasAccess, setHasAccess] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const mapRef = useRef(null);
  const routeCalculatedRef = useRef(false);
  const socketRef = useRef(null);
  const [locationError, setLocationError] = useState(null);
  const locationWatchId = useRef(null);
  const reconnectAttempts = useRef(0);

  // Load last known location from localStorage on initial render
  useEffect(() => {
    const savedLocation = localStorage.getItem('lastDriverLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        if (parsedLocation.lat && parsedLocation.lng) {
          setDriverLocation(parsedLocation);
          console.log('Restored last known driver location from storage');
        }
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const getToken = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData).token : null;
  };

  const getUserEmail = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData).email : '';
  };

  useEffect(() => {
    const handleGeolocationSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log('Current position:', latitude, longitude);
      setCurrentLocation({
        lat: latitude,
        lng: longitude,
        accuracy: accuracy
      });
      setLocationError(null);
    };

    const handleGeolocationError = (error) => {
      console.error('Geolocation error:', error);
      setLocationError(
        error.code === error.PERMISSION_DENIED 
          ? 'Location permission denied. Please enable location services.' 
          : 'Failed to get your location'
      );
    };

    const startGeolocationTracking = () => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        return;
      }

      console.log('Starting geolocation tracking...');
      locationWatchId.current = navigator.geolocation.watchPosition(
        handleGeolocationSuccess,
        handleGeolocationError,
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 15000
        }
      );
    };

    startGeolocationTracking();

    return () => {
      if (locationWatchId.current) {
        console.log('Cleaning up geolocation watcher');
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, []);

  const getVehicleIcon = () => ({
    path: "M -2,-1 L 2,-1 L 2,1 L -2,1 Z",
    fillColor: '#EA4335',
    fillOpacity: 1,
    scale: 10,
    strokeColor: 'white',
    strokeWeight: 3,
  });

  const getCurrentLocationIcon = () => ({
    path: window.google?.maps?.SymbolPath.CIRCLE || '',
    fillColor: '#4285F4',
    fillOpacity: 1,
    scale: 16,
    strokeColor: 'white',
    strokeWeight: 2,
  });

  const calculateRoute = useCallback((origin, destination) => {
    if (!window.google || !window.google.maps) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          const totalDistance = result.routes[0].legs[0].distance.value / 1000;
          const totalDuration = result.routes[0].legs[0].duration.value / 60;
          setDistance(totalDistance.toFixed(2));
          setDuration(Math.round(totalDuration));
        }
      }
    );
  }, []);

  const fetchTaskDetails = useCallback(async (taskId) => {
    try {
      const userEmail = getUserEmail();
      console.log('Fetching task details for user:', userEmail);
      if (!userEmail) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }
      const token = getToken();
      console.log('Fetching task details for taskId:', taskId);

      const res = await axios.get(`https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/vehicle-request/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.email === userEmail) {
        setTask(res.data);
        setHasAccess(true);
        
        // Save task details to localStorage for persistence
        localStorage.setItem('lastTrackingTask', JSON.stringify(res.data));
      } else {
        setError('You do not have access to this trip');
        setHasAccess(false);
      }
      console.log('Task details:', res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const taskIdRef = useRef(taskId);

  useEffect(() => {
    taskIdRef.current = taskId;
  }, [taskId]);

  const initWebSocket = useCallback(() => {
    if (reconnectAttempts.current > 5) {
      console.log('Max reconnection attempts reached');
      return;
    }

    setConnectionStatus('connecting');
    const ws = new WebSocket('wss://urban-space-fiesta-pjg55v44qp6gfr96v-5050.app.github.dev/ws/driver-tracking');

    ws.onopen = () => {
      reconnectAttempts.current = 0;
      ws.send(JSON.stringify({ type: 'monitor_register' }));
      socketRef.current = ws;
      setConnectionStatus('connected');
      console.log('WebSocket connected');
    };

    ws.onmessage = (e) => {
      console.log('📩 WebSocket message received:', e.data);
      try {
        const data = JSON.parse(e.data);

        if (data.type === 'location_update') {
          const newPos = {
            lat: data.latitude,
            lng: data.longitude,
            accuracy: data.accuracy,
            heading: data.heading || 0,
            timestamp: Date.now()
          };
          
          // Always update the driver location when we receive new data
          setDriverLocation(newPos);
          setLastUpdateTime(new Date().toLocaleTimeString());
          
          // Save to localStorage for persistence
          localStorage.setItem('lastDriverLocation', JSON.stringify(newPos));
          
          // Set task ID if we don't have it yet
          if (data.taskId && !taskIdRef.current) {
            setTaskId(data.taskId);
            fetchTaskDetails(data.taskId);
          }

          // Calculate route if we have destination coordinates
          if (task?.to?.coordinates && data.taskId === taskIdRef.current) {
            const [toLng, toLat] = task.to.coordinates;
            calculateRoute(newPos, { lat: toLat, lng: toLng });
          }
        }
      } catch (err) {
        console.error('Error processing message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setConnectionStatus('disconnected');
      socketRef.current = null;
      
      // Exponential backoff for reconnection
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current += 1;
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (attempt ${reconnectAttempts.current})`);
        initWebSocket();
      }, delay);
    };

    return ws;
  }, [task?.to?.coordinates, calculateRoute, fetchTaskDetails]);

  // Check for existing task data on mount
  useEffect(() => {
    const savedTask = localStorage.getItem('lastTrackingTask');
    const savedTaskId = localStorage.getItem('lastTrackingTaskId');
    
    if (savedTaskId) {
      setTaskId(savedTaskId);
      if (savedTask) {
        try {
          const parsedTask = JSON.parse(savedTask);
          setTask(parsedTask);
          setHasAccess(true);
        } catch (e) {
          console.error('Failed to parse saved task', e);
        }
      } else {
        fetchTaskDetails(savedTaskId);
      }
    }
  }, [fetchTaskDetails]);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = initWebSocket();
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [initWebSocket]);

  // Calculate initial route when map loads
  useEffect(() => {
    if (!isLoaded || !task || routeCalculatedRef.current || !hasAccess) return;
    
    const [fromLng, fromLat] = task.from.coordinates;
    const [toLng, toLat] = task.to.coordinates;
    
    // Use driver location if available, otherwise use trip start point
    const origin = driverLocation || { lat: fromLat, lng: fromLng };
    calculateRoute(origin, { lat: toLat, lng: toLng });
    routeCalculatedRef.current = true;
  }, [isLoaded, task, calculateRoute, hasAccess, driverLocation]);

  // Start trip timer when we have driver location
  useEffect(() => {
    if (!driverLocation || !hasAccess) return;
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [driverLocation, hasAccess]);

  const handleCenterMap = () => {
    if (driverLocation && mapRef.current) {
      mapRef.current.panTo(driverLocation);
      mapRef.current.setZoom(17);
    } else if (currentLocation && mapRef.current) {
      mapRef.current.panTo(currentLocation);
      mapRef.current.setZoom(17);
    }
  };

  const handleReconnect = () => {
    reconnectAttempts.current = 0;
    initWebSocket();
  };

  const formatCoordinates = (location) => {
    if (!location?.coordinates) return 'Location not specified';
    const [longitude, latitude] = location.coordinates;
    return `${latitude?.toFixed(6) || 'N/A'}, ${longitude?.toFixed(6) || 'N/A'}`;
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs].map(v => v.toString().padStart(2, '0')).join(':');
  };

  const formatTimeSinceUpdate = () => {
    if (!lastUpdateTime) return 'No updates yet';
    
    const now = new Date();
    const updateTime = new Date(`01/01/2000 ${lastUpdateTime}`);
    const diffMs = now - updateTime;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    return `${Math.floor(diffSec / 3600)} hours ago`;
  };

  if (!hasAccess || !taskId) return <NoOngoingTrips />;

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
                {driverLocation && (
                  <>
                    <div className="flex items-center gap-3">
                      <Timer className="text-[#800000]" />
                      <div>
                        <p className="text-sm text-gray-600">Trip Duration</p>
                        <p className="font-medium">{formatTime(elapsedTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="text-[#800000]" />
                      <div>
                        <p className="text-sm text-gray-600">Last Update</p>
                        <p className="font-medium">{formatTimeSinceUpdate()}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {isLoaded ? (
              <div className="bg-white/90 rounded-xl shadow-lg p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#800000]">
                    Real-Time Tracking
                  </h2>
                  <div className="flex items-center gap-2">
                    <ConnectionStatus status={connectionStatus} />
                    {connectionStatus !== 'connected' && (
                      <button 
                        onClick={handleReconnect}
                        className="flex items-center gap-1 text-sm text-[#800000] hover:text-[#600000]"
                      >
                        <RefreshCw size={14} /> Reconnect
                      </button>
                    )}
                    {taskId && <span className="text-sm text-gray-600">Task ID: {taskId}</span>}
                  </div>
                </div>
                
                <div className="h-[600px] rounded-lg overflow-hidden relative">
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={driverLocation || currentLocation || {
                      lat: task?.from?.coordinates[1] || 0,
                      lng: task?.from?.coordinates[0] || 0
                    }}
                    zoom={driverLocation ? 17 : 15}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                    }}
                    onLoad={map => mapRef.current = map}
                  >
                    {/* Driver Location (Red - Larger) */}
                    {driverLocation && (
                      <Marker 
                        position={driverLocation}
                        icon={getVehicleIcon()}
                        title="Driver Location"
                        zIndex={100}
                      />
                    )}

                    {/* Current Location (Blue - Smaller) */}
                    {currentLocation && (
                      <Marker
                        position={currentLocation}
                        icon={getCurrentLocationIcon()}
                        title="Your Location"
                        zIndex={90}
                      />
                    )}

                    {/* Directions Renderer */}
                    {directions && (
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          suppressMarkers: true,
                          polylineOptions: {
                            strokeColor: '#800000',
                            strokeOpacity: 0.8,
                            strokeWeight: 5
                          }
                        }}
                      />
                    )}
                  </GoogleMap>

                  {locationError && (
                    <div className="absolute bottom-20 left-4 bg-white/90 p-2 rounded-lg shadow-md text-red-500 text-sm">
                      <AlertTriangle className="inline mr-2" size={16} />
                      {locationError}
                    </div>
                  )}
                  <button
                    onClick={handleCenterMap}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg"
                  >
                    <LocateFixed className="text-[#800000]" />
                  </button>
                </div>

                {(driverLocation || directions) && (
                  <div className="mt-4 p-4 bg-[#800000]/10 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium">
                          {connectionStatus === 'connected' ? (
                            driverLocation?.accuracy < 30 ? (
                              <span className="flex items-center text-green-500">
                                <CheckCircle className="mr-1" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center text-yellow-500">
                                <AlertTriangle className="mr-1" /> Low Accuracy
                              </span>
                            )
                          ) : (
                            <span className="flex items-center text-gray-500">
                              <AlertTriangle className="mr-1" /> Offline
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="font-medium">
                          {driverLocation?.accuracy?.toFixed(0) || '--'} meters
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Distance</p>
                        <p className="font-medium">{distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ETA</p>
                        <p className="font-medium">{duration} min</p>
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

const NoOngoingTrips = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] flex items-center justify-center">
      <div className="bg-white/90 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mx-auto w-20 h-20 bg-[#800000]/10 rounded-full flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#800000" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#800000] mb-2">No Ongoing Trips or No Signal from Driver</h2>
        <p className="text-gray-600 mb-6">
          Currently there are no active trips associated with your account/No Signal from Driver.
        </p>
        <button 
          className="w-full bg-[#800000] hover:bg-[#600000] text-white py-3 rounded-xl font-medium transition-colors"
          onClick={() => window.location.href = '/user-dashboard'}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

const ConnectionStatus = ({ status }) => {
  const statusMap = {
    disconnected: { text: 'Disconnected', color: 'bg-gray-500' },
    connecting: { text: 'Connecting', color: 'bg-yellow-500' },
    connected: { text: 'Connected', color: 'bg-green-500' },
    error: { text: 'Error', color: 'bg-red-500' }
  };

  const currentStatus = statusMap[status] || statusMap.disconnected;

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${currentStatus.color}`}></span>
      <span className="text-sm font-medium">{currentStatus.text}</span>
    </div>
  );
};

export default TrackingDashboard;