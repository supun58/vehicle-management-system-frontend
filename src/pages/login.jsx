import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GrFormView, GrFormViewHide } from "react-icons/gr"; // Icons for password visibility
import { Car } from "lucide-react"; // Import Car icon

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    // Check if fields are empty and show appropriate error messages
    if (email === "" || password === "") {
      if (email === "") setEmailError(true);
      if (password === "") setPasswordError(true);
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Reset errors
    setEmailError(false);
    setPasswordError(false);

    // Send login request
    axios
      .post("http://localhost:5000/api/auth/login", { email, password })
      .then((response) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", response.data.role);

        // Redirect based on user role
        if (response.data.role === "student") {
          navigate("/user-dashboard");
        } else if (response.data.role === "lecturer") {
          navigate("/user-dashboard");
        } else if (response.data.role === "driver") {
          navigate("/driver-dashboard");
        } else if (response.data.role === "nonAcademic") {
          navigate("/user-dashboard");
        }
      })
      .catch((error) => {
        // Handle errors based on specific server response
        if (error.response) {
          if (error.response.data.message === "No such email") {
            alert("No such email found.");
          } else if (error.response.data.message === "Incorrect password") {
            alert("Incorrect password.");
          } else {
            // Generic error if the response message is not specific
            alert(error.response.data.message || "An error occurred during login");
          }
        } else {
          // If there's no response from the server
          alert("An error occurred. Please try again.");
        }
      });
  };

  // Handle clearing error state when typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value !== "") {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value !== "") {
      setPasswordError(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Logo Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 flex-col items-center justify-center p-12">
        <div className="text-center">
          <div className="h-20 w-20 text-ash-200 mx-auto mb-6">
            {/* Car Icon */}
            <Car className="h-full w-full text-ash-200" />
          </div>
          <h1 className="text-4xl font-bold text-ash-100 mb-4">
            University of Ruhuna
          </h1>
          <p className="text-ash-300 text-lg max-w-md">
            Streamlining University Operations: Efficiently Manage Resources,
            Events, and Student Services
          </p>
          <span className="text-maroon-700">New visitor? </span>
          <a
            href="#"
            className="text-maroon-600 hover:text-maroon-700 underline"
          >
            login here
          </a>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-maroon-700 mb-6">Login</h2>
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
                className={`w-full p-2 mt-1 rounded-lg border ${
                  emailError ? "border-red-500" : "border-ash-300"
                } focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent`}
                placeholder="john.doe@example.com"
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-2">Email is required</p>
              )}
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
                className={`w-full p-2 mt-1 rounded-lg border ${
                  passwordError ? "border-red-500" : "border-ash-300"
                } focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent`}
                placeholder="Enter your password"
                required
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-2">Password is required</p>
              )}
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
