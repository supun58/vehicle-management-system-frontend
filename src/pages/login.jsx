import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { Car } from "lucide-react";
import Alert from "../components/Alert";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.jpg";
import bg3 from "../assets/bg3.jpg";
import { useAuth } from "../controllers/authcontext";

export default function Login() {
  const images = [bg1, bg2, bg3];
  const [currentImage, setCurrentImage] = useState(0); // Define state for current image
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false); // State for alert visibility
  const [alertTitle, setAlertTitle] = useState(""); // State for alert title
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 10) % images.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    setAlertVisible(false); // Clear alert on submit

    if (email === "" || password === "") {
      setAlertTitle("Error");
      setAlertMessage("Email and password are required.");
      setAlertVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setAlertTitle("Invalid Email");
      setAlertMessage("Please enter a valid email address.");
      setAlertVisible(true);
      return;
    }

    axios
      .post("http://localhost:5000/api/auth/login", { email, password })
      .then((response) => {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        // Store token and user data via AuthContext
        login(response.data.token, {
          token: response.data.token,
          _id: response.data._id,
          full_name: response.data.full_name,
          email: response.data.email,
          role: response.data.role,
          account_status: response.data.account_status,
        });

        // Redirect based on user role
        if (response.data.role === "student") {
          navigate("/user-dashboard");
        } else if (
          response.data.role === "lecturer" &&
          response.data.account_status === "Confirmed"
        ) {
          navigate("/user-dashboard");
        } else if (response.data.role === "driver") {
          navigate("/driver-dashboard");
        } else if (response.data.role === "nonAcademic") {
          navigate("/user-dashboard");
        } else if (response.data.role === "admin") {
          navigate("/admin-dashboard");
        } else if (response.data.role === "guard") {
          navigate("/guard-dashboard");
        } else if (response.data.account_status === "Faculty Admin") {
          navigate("/faculty-admin-dashboard");
        }
        localStorage.setItem("driverId", response.data._id);
        setAlertTitle("Success");
        setAlertMessage("Login successful!");
        setAlertVisible(true);
      })
      .catch((error) => {
        if (error.response) {
          setAlertTitle("Login Failed");
          setAlertMessage(error.response.data.error);
        } else {
          setAlertTitle("Error");
          setAlertMessage("An error occurred. Please try again.");
        }
        setAlertVisible(true);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Enhanced with smooth transitions */}
      <div className="hidden md:flex md:w-2/3 lg:w-3/5 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Blurred Background with Smooth Transition */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105 transition-all duration-1000 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            transitionProperty: "filter, transform", // Explicitly specify properties
            willChange: "filter, transform", // Optimize for animation
          }}
        ></div>

        {/* Gradient Overlay with Smooth Opacity Transition */}
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-900/40 via-ash-900/30 to-ash-800/20 transition-opacity duration-1000 ease-in-out"></div>

        {/* Text Container with Subtle Entrance Animation */}
        <div
          className="relative z-10 text-center p-8 transition-all duration-700 ease-out delay-100"
          style={{
            animation: "fadeInUp 700ms ease-out both",
            willChange: "opacity, transform",
          }}
        >
          {/* Icon with Gentle Pulse Animation */}
          <div
            className="h-20 w-20 mx-auto mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] 
                        animate-[pulse_6s_ease-in-out_infinite]"
          >
            <Car className="h-full w-full text-white transition-colors duration-500" />
          </div>

          {/* Heading with Text Shadow Transition */}
          <h1
            className="text-3xl font-bold text-white mb-4 
                         drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]
                         transition-all duration-500 hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
          >
            University of Ruhuna Vehicle Management System
          </h1>

          {/* Paragraph with Delayed Fade-in */}
          <p
            className="text-0.5xl text-ash-100 font-bold max-w-md mx-auto leading-relaxed
                        drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]
                        transition-opacity duration-700 delay-200"
          >
            Streamlining University Operations: Efficiently Manage Resources,
            Events, and Student Services
          </p>
        </div>
      </div>

      {/* Right Section - Now takes less space on larger screens */}
      <div className="w-full md:w-1/3 lg:w-2/5 bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-maroon-700 mb-6">Login</h2>

          {/* Show Alert when visible */}
          {alertVisible && (
            <Alert
              title={alertTitle}
              message={alertMessage}
              setAlertVisible={setAlertVisible}
            />
          )}

          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ash-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-2 mt-1 rounded-lg border border-ash-300 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ash-700"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-2 mt-1 rounded-lg border border-ash-300 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              {password !== "" && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 top-6 flex justify-center items-center focus:outline-none"
                >
                  {showPassword ? (
                    <GrFormViewHide size={24} />
                  ) : (
                    <GrFormView size={24} />
                  )}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-maroon-700 text-white p-2 rounded-lg hover:bg-maroon-600 transition-colors duration-300"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-sm text-center text-ash-600">
            <span>New user? </span>
            <a
              href="/register"
              className="text-maroon-600 hover:text-maroon-700 underline"
            >
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
