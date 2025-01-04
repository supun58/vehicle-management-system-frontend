import React from "react";
import { Car } from "lucide-react";
import App from "../App";


export default function Login() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Logo Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 flex-col items-center justify-center p-12">
        <div className="text-center">
          <Car className="h-20 w-20 text-ash-200 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-ash-100 mb-4">
            University of Ruhuna
          </h1>
          <p className="text-ash-300 text-lg max-w-md">
            Streamlining University Operations: Efficiently Manage Resources,
            Events, and Student Services
          </p>
          <span className="text-maroon-700 ">New visitor? </span>
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
                className="w-full p-2 mt-1 rounded-lg border border-ash-300 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ash-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 mt-1 rounded-lg border border-ash-300 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-maroon-700 text-white p-2 rounded-lg hover:bg-maroon-600 transition-colors duration-300"
            >
              Submit
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
