import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    Phone: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    account_type: "",
    account_status: "",
    profilePicUrl: ""
  });
  const [preview, setPreview] = useState("/default-profile.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    res: {},
  });
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/users/${id}`);
        setFormData({
          full_name: res.data.account_status === "Admin" ? res.data.name || "" : res.data.full_name || "",
          name: res.data.name || "",
          email: res.data.email || "",
          Phone: res.data.phone || "",
          account_type: res.data.account_type || "",
          account_status: res.data.account_status || ""
        });
        if (res.data.profilePicUrl) {
          setPreview(`http://localhost:5000${res.data.profilePicUrl}`);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if passwords match
    if (formData.password && formData.password !== formData.confirmPassword) {
      setAlert({
        visible: true,
        title: "Password Mismatch",
        message: "Passwords do not match!",
      });
      setIsLoading(false);
      return;
    }

    try {
      // If there's a selected profile picture, upload it first
      if (selectedFile) {
        const imageData = new FormData();
        imageData.append("profilePic", selectedFile);

        const imageUploadRes = await axios.post(
          `http://localhost:5000/api/auth/users/${id}/upload-profile-pic`,
          imageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update the formData with the new profilePicUrl
        formData.profilePicUrl = imageUploadRes.data.profilePicUrl;
      }

      // Prepare final update payload
      const updatePayload = {
        name: formData.full_name,
        full_name: formData.full_name,
        phone: formData.Phone,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      if (formData.profilePicUrl) {
        updatePayload.profilePicUrl = formData.profilePicUrl;
      }

      // Send update request
      await axios.put(
        `http://localhost:5000/api/auth/users/${id}`,
        updatePayload
      );

      console.log(updatePayload);
      
      setAlert({
        visible: true,
        title: "Profile Updated Successfully",
        message: "Please Login Again!."
      });
 ////logout the user and redirect to login page after 3s delay
      setTimeout(() => {
        localStorage.clear(); // Clear saved session
        window.location.href = "/"; // Redirect to login page
      }, 3000);

      // if (formData.account_type === "student") {
      //   window.location.href = "/user-dashboard";
      // } else if (formData.account_type === "driver") {
      //   window.location.href = "/driver-dashboard";
      // } else if (formData.account_type === "lecturer") {
      //   window.location.href = "/user-dashboard";
      // } else if (formData.account_type === "nonAcademic") {
      //   window.location.href = "/user-dashboard";
      // } else if (formData.account_type === "guard") {
      //   window.location.href = "/guard-dashboard";
      // } else if (formData.account_status === "Faculty Admin") {
      //   window.location.href = "/faculty-admin-dashboard";

      // } else {

      // window.location.href = "/Admin-dashboard";}

    } catch (err) {
      console.error("Error updating profile:", err);
      setAlert({
        visible: true,
        title: "Profile Update Failed",
        message: err.response?.data?.message || "Your profile could not be updated.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-800 to-yellow-700 p-4 sm:p-6 flex justify-center items-start md:items-center text-white font-medium pt-20 mt-14">
      {alert.visible && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) =>
            setAlert((prev) => ({ ...prev, visible }))
          }
        />
      )}
      
      {/* Profile Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 w-full max-w-md border border-white border-opacity-20"
        encType="multipart/form-data"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <p className="text-sm text-white text-opacity-70 mt-1">
            Update your personal information
          </p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-white border-opacity-30 group-hover:border-opacity-60 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </div>
          <label className="cursor-pointer text-white text-sm font-medium text-center px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Change Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

{/* Form Fields */}
<div className="space-y-4">
  <div>
    <label className="block mb-2 text-sm font-medium text-white text-opacity-80">
      Edit Name
    </label>
    <div className="relative">
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:border-opacity-40 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white placeholder-white placeholder-opacity-50 transition-all duration-200"
        placeholder="Enter your full name"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>
  </div>

{!(formData.account_status === "Admin") && (
          <div>
            <label className="block mb-2 text-sm font-medium text-white text-opacity-80">
              Edit Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:border-opacity-40 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white placeholder-white placeholder-opacity-50 transition-all duration-200"
                placeholder="Enter your phone number"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>
)}

          <div>
            <label className="block mb-2 text-sm font-medium text-white text-opacity-80">
              Create New Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:border-opacity-40 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white placeholder-white placeholder-opacity-50 transition-all duration-200"
                placeholder="Enter new password"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white text-opacity-80">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:border-opacity-40 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white placeholder-white placeholder-opacity-50 transition-all duration-200"
                placeholder="Confirm your password"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center ${
            isLoading 
              ? "bg-yellow-600 cursor-not-allowed" 
              : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-yellow-500/30"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;