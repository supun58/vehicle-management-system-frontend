import React, { useState, useEffect } from "react";
import { Car, Calendar } from "lucide-react";

function Dashboard() {
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserEmail = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData).email : '';
  };

  console.log("User Email:", getUserEmail());

  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/auth/vehicle-requests', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent trips');
        }
        
        const data = await response.json();
        // Filter trips to only show those belonging to the current user
        const userTrips = data.filter(trip => trip.email === getUserEmail());
        setRecentTrips(userTrips);
      } catch (err) {
        console.error('Error fetching recent trips:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTrips();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">

          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">User Dashboard</h1>
            <p className="text-ash-200">Manage your transportation system efficiently</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
            {/* Request Vehicle Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-maroon-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Request a Vehicle
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Easily request a vehicle for your trips or official purposes.
              </p>
              <a href="/request-vehicle">
                <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                  Request Now
                </button>
              </a>
            </div>

            {/* Trip Details Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-ash-600" />
                <h3 className="ml-2 text-xl font-bold text-ash-700">
                  Ongoing Trip Details
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                View and manage your trip details, schedules, and history.
              </p>
              <a href="/tracking-dashboard">
                <button className="w-full bg-ash-600 text-white px-6 py-2 rounded-md hover:bg-ash-500 transition duration-300">
                  View Details
                </button>
              </a>
            </div>
          </div>

          {/* Recent Trips Table */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 text-maroon-700">
              Recent Trips
            </h2>
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maroon-700"></div>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">
                  Error loading recent trips: {error}
                </div>
              ) : recentTrips.length === 0 ? (
                <div className="text-center py-4 text-ash-600">
                  No recent trips found
                </div>
              ) : (
                <table className="min-w-full text-left">
                  <thead className="bg-ash-100">
                    <tr>
                      <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                        Date
                      </th>
                      <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ash-200">
                    {recentTrips.map((trip, index) => (
                      <tr key={index} className="hover:bg-ash-50">
                        <td className="px-6 py-4 text-sm text-ash-800">
                          {new Date(trip.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-ash-600">
                          {trip.purpose}
                        </td>
                        <td className="px-6 py-4 text-sm text-ash-600">
                          {trip.AssignedDriver?.vehicle || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 inline-flex text-xs font-semibold leading-5 rounded-full ${
                            trip.status === 'Completed' 
                              ? 'bg-maroon-100 text-maroon-800'
                              : trip.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : trip.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-ash-100 text-ash-800'
                          }`}>
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;