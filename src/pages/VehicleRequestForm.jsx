import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../controllers/authcontext";
import Alert from "../components/Alert";
import { X } from "lucide-react";
import LocationPickerModal from "../controllers/LocationPickerModal";


export default function VehicleRequestForm() {
  const { token,logout } = useAuth();
  const navigate = useNavigate();

  const userData = localStorage.getItem('userData');
  const full_name = userData ? JSON.parse(userData).full_name : '';
  const role = userData ? JSON.parse(userData).role : '';
  const email = userData ? JSON.parse(userData).email : '';

  // Form state
  const [formData, setFormData] = useState({
    name: full_name || "",
    contact: "",
    vehicleType: "",
    purpose: "",
    textfrom: "",
    from: "",
    textto: "",
    to: "",
    distance: "",
    date: "",
    supporting_documents: null
  });

  // Location state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [distance, setDistance] = useState("");
  const [showCustomFrom, setShowCustomFrom] = useState(false);
  const [showCustomTo, setShowCustomTo] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [textfrom, setTextFrom] = useState(""); // State for 'textfrom'
  const [textto, setTextTo] = useState(""); // State for 'textto'
const [selectedStartLocation, setSelectedStartLocation] = useState(null);
const [selectedDestinationLocation, setSelectedDestinationLocation] = useState(null);
const [isSelecting, setIsSelecting] = useState(""); // 'start' or 'destination'


  const [showMapModal, setShowMapModal] = useState(false);
const [locationType, setLocationType] = useState(""); // 'from' or 'to'


  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    isError: false
  });

  console.log(selectedStartLocation); // Debugging step

  const places = [
    "Faculty of Science",
    "Main Library",
    "Auditorium",
    "Cafeteria",
    "Engineering Faculty",
    "Administration Building",
    "Hostels",
  ];

  const openMap = (type) => {
    setLocationType(type);
    setShowMapModal(true);
  };
  
  const handleLocationSelect = (coords) => {
    const locString = `${coords.lat}, ${coords.lng}`;
    if (locationType === "from") setFrom(locString);
    else setTo(locString);
  };
  

  // Show alert function
  const showAlert = (title, message, isError = false) => {
    setAlertData({ title, message, isError });
    setAlertVisible(true);
  };

  // Set minimum date (tomorrow) and ensure name is synced
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const minDate = tomorrow.toISOString().split("T")[0];
    document.getElementById("date")?.setAttribute("min", minDate);

    if (full_name && formData.name !== full_name) {
      setFormData(prev => ({ ...prev, name: full_name }));
    }
  }, [full_name]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
    if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!selectedStartLocation) newErrors.selectedStartLocation = "Starting point is required";
    if (!selectedDestinationLocation) newErrors.selectedDestinationLocation = "Destination is required";
    if (selectedStartLocation === selectedDestinationLocation) newErrors.selectedDestinationLocation = "Destination must be different from starting point";
    if (!distance || isNaN(distance) || distance <= 0) newErrors.distance = "Valid distance is required";

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      showAlert("Validation Error", "Please fix the errors in the form!", true);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!token) {
        showAlert("Session Expired", "Please log in again!", true);
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      const formPayload = new FormData();
      formPayload.append('full_name', full_name);
      formPayload.append('email', email);
      formPayload.append('role', role);
      formPayload.append("contact", formData.contact);
      formPayload.append("vehicleType", formData.vehicleType);
      formPayload.append("purpose", formData.purpose);
      formPayload.append("date", formData.date);
      formPayload.append("Time", formData.time);
      formPayload.append("textfrom", formData.textfrom);
      formPayload.append("textto", formData.textto);
      formPayload.append("from", JSON.stringify({
        type: "Point",
        coordinates: [selectedStartLocation.lng, selectedStartLocation.lat]
      }));
      formPayload.append("to", JSON.stringify({
        type: "Point",
        coordinates: [selectedDestinationLocation.lng, selectedDestinationLocation.lat]
      }));
      formPayload.append("distance", distance);

      console.log("Form Data:", formPayload); // Debugging step

      if (formData.supporting_documents) {
        formPayload.append("supporting_documents", formData.supporting_documents);
      }
      const response = await fetch("https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/request-vehicle", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formPayload
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit request!");
        
      }

      showAlert("Success", "Request submitted successfully!");
      setTimeout(() => navigate("/user-dashboard"), 3000);
      
    } catch (error) {
      console.error("Submission error:", error);
      logout();
      showAlert("Error", error.message || "Failed to submit request. Please try again.", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Alert Component */}
      {alertVisible && (
        <Alert
          title={alertData.title}
          message={alertData.message}
          setAlertVisible={setAlertVisible}
        />
      )}

{showLocationModal && (
  <LocationPickerModal
    onClose={() => setShowLocationModal(false)}
    onSelectLocation={(location) => {
      if (isSelecting === 'start') {
        setSelectedStartLocation(location);
      } else {
        setSelectedDestinationLocation(location);
      }
      setShowLocationModal(false);
    }}
    initialLocation={
      isSelecting === 'start'
        ? selectedStartLocation
        : selectedDestinationLocation
    }
  />
)}


      <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Request a Vehicle</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Contact */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className={`w-full p-2 mt-1 rounded-lg border ${errors.contact ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring focus:ring-blue-300`}
                placeholder="Enter your contact number"
                required
              />
              {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
            </div>

            {/* Vehicle Type */}
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                Vehicle Type *
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className={`w-full p-2 mt-1 rounded-lg border ${errors.vehicleType ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring focus:ring-blue-300`}
                required
              >
                <option value="" disabled>Select vehicle type</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Bus">Bus</option>
              </select>
              {errors.vehicleType && <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>}
            </div>

            {/* Purpose */}
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                Purpose *
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className={`w-full p-2 mt-1 rounded-lg border ${errors.purpose ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring focus:ring-blue-300`}
                placeholder="Explain the purpose of the request"
                required
                rows={4}
              />
              {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
            </div>

            {/* Proofs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supporting Documents (Optional)
              </label>
              <input
                type="file"
                name="supporting_documents"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#800000] file:text-white hover:file:bg-[#600000]"
              />
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: PDF, JPG, PNG (max 5MB)
              </p>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2 mt-1 rounded-lg border ${errors.date ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring focus:ring-blue-300`}
                required
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            {/*Time*/}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-2 mt-1 rounded-lg border ${errors.time ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring focus:ring-blue-300`}
                required
              />
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700">Enter the Starting Point *</label>
  <input
    type="text"
    name="textfrom"
    value={formData.textfrom}
    onChange={(e) => setFormData({ ...formData, textfrom: e.target.value })}    
    className="w-full p-2 mt-1 rounded-lg border border-gray-300"
    placeholder="Enter name of the origin location"
  />
  {errors.textfrom && <p className="mt-1 text-sm text-red-600">{errors.textfrom}</p>}
</div>

{/* From Location (Button Styled) */}
<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">From *</label>
  <button
    type="button"
    onClick={() => { setIsSelecting('start'); setShowLocationModal(true); }}
    className="w-full p-2 mt-1 rounded-lg border border-gray-300 text-white font-medium"
    style={{
      backgroundColor: '#800000',
    }}
  >
    {selectedStartLocation?.address || "Click to select location"}
  </button>
  {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
</div>

{/* To Name (TextTo) */}
<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">Enter the Destination *</label>
  <input
    type="text"
    name="textto"
    value={formData.textto}
    onChange={(e) => setFormData({ ...formData, textto: e.target.value })}    
    className="w-full p-2 mt-1 rounded-lg border border-gray-300"
    placeholder="Enter name of the destination location"
  />
  {errors.textto && <p className="mt-1 text-sm text-red-600">{errors.textto}</p>}
</div>

{/* To Location (Button Styled) */}
<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">To *</label>
  <button
    type="button"
    onClick={() => { setIsSelecting('destination'); setShowLocationModal(true); }}
    className="w-full p-2 mt-1 rounded-lg border border-gray-300 text-white font-medium"
    style={{
      backgroundColor: '#800000',
    }}
  >
    {selectedDestinationLocation?.address || "Click to select location"}
  </button>
  {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
</div>


            {/* Distance */}
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                Distance (in km) *
              </label>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                min="0.1"
                step="0.1"
                className={`w-full p-2 mt-1 rounded-lg border ${errors.distance ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring focus:ring-blue-300`}
                placeholder="Enter distance"
                required
              />
              {errors.distance && <p className="mt-1 text-sm text-red-600">{errors.distance}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#800000] text-white p-3 rounded-lg hover:bg-[#600000] transition duration-300 disabled:opacity-50 mt-6"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}