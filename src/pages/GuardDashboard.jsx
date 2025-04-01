import React, { useState, useCallback } from "react";
import { Calendar, Car, X } from "lucide-react";
import QrScanner from 'react-qr-scanner';

function GuardDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = useCallback((data) => {
    if (data) {
      setScanResult(data);
      setShowScanner(false);
      
      try {
        // Validate URL
        const url = new URL(data.text);
        // Check if URL is using HTTP or HTTPS protocol
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          // Navigate to the URL
          window.location.href = data.text;
        } else {
          setError('Invalid URL protocol');
        }
      } catch (e) {
        setError('Invalid QR code URL format');
      }
    }
  }, []);

  const handleError = (err) => {
    console.error(err);
    setError('Error scanning QR code');
  };

  const resetError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 relative">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl">

          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Guard Dashboard</h1>
            <p className="text-ash-200">Manage your transportation system efficiently</p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Scan QR Code Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
              <div className="flex items-center mb-6">
                <Calendar className="h-8 w-8 text-maroon-600" />
                <h3 className="ml-3 text-2xl font-bold text-maroon-700">
                  Scan QR Code
                </h3>
              </div>
              <p className="text-ash-600 mb-8 text-lg">
                Scan the QR code to verify the vehicle and track its movement.
              </p>
              <button
                onClick={() => {
                  setShowScanner(true);
                  resetError();
                }}
                className="w-full bg-maroon-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-maroon-600 transition duration-300 flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Scan QR Code
              </button>
              {error && (
                <div className="mt-4 p-4 bg-red-100 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </div>

            {/* Request Vehicles Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
              <div className="flex items-center mb-6">
                <Car className="h-8 w-8 text-maroon-600" />
                <h3 className="ml-3 text-2xl font-bold text-maroon-700">
                  Request Vehicles
                </h3>
              </div>
              <p className="text-ash-600 mb-8 text-lg">
                Submit requests for vehicles needed for official duties and operations.
              </p>
              <a
                href="/request-vehicle"
                className="block w-full bg-maroon-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-maroon-600 transition duration-300 text-center"
              >
                <button className="flex items-center justify-center gap-2 w-full">
                  <Car className="h-5 w-5" />
                  Request Vehicle
                </button>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-maroon-700">Scan QR Code</h3>
              <button
                onClick={() => {
                  setShowScanner(false);
                  resetError();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Position the QR code within the frame to scan
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuardDashboard;