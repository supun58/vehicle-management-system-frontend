import React from "react";

const AboutUs = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://media.licdn.com/dms/image/v2/C4E1BAQGUGhRlEXo2-Q/company-background_10000/company-background_10000/0/1583866513572?e=1739206800&v=beta&t=1N6LJXlVj6cnpLowBPi9AWTzIHqlHbP1pLhyW1p6QaU')",
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
                Web Development
              </h3>
              <p className="text-gray-600">
                Building responsive, user-friendly websites with the latest web
                technologies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Mobile App Development
              </h3>
              <p className="text-gray-600">
                Developing high-quality mobile applications for iOS and Android
                platforms.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Machine Learning
              </h3>
              <p className="text-gray-600">
                Implementing AI and machine learning algorithms to solve complex
                problems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
