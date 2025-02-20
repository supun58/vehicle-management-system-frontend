import React, { useState, useEffect } from "react";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.jpg";
import bg3 from "../assets/bg3.jpg";

export default function AboutUs() {
  const images = [bg1, bg2, bg3];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 10) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  });
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6 text-center">
        <p className="max-w-3xl text-lg bg-black bg-opacity-50 p-4 rounded-lg mb-8">
          Our journey started with a vision to streamline vehicle management.
          Over the years, we have expanded our services to provide efficient,
          reliable, and cutting-edge solutions for fleet management,
          maintenance, and tracking. With innovation and customer satisfaction
          at our core, we continue to evolve, ensuring businesses and
          individuals can manage their vehicles with ease.
        </p>

        {/* Services Section */}
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center  mb-8">Our Services</h2>
          <p className="text-center text-lg  mb-12">
            We provide a wide range of services to help you grow your business
            and enhance your digital experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Vehicle Management
              </h3>
              <p className="text-gray-600">
                Requesting vehicles for official purposes and tracking their
                status.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Visitor Management
              </h3>
              <p className="text-gray-600">
                Managing visitors and ensuring a secure environment for all.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Driver Management
              </h3>
              <p className="text-gray-600">
                Assigning drivers to vehicles and tracking their performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
