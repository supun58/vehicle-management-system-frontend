import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    Phone: "",
    password: "",
    confirmPassword: "",
  });
  const [preview, setPreview] = useState("/default-profile.png");
  const [selectedFile, setSelectedFile] = useState(null);

  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    res: {},
  });
  const id = localStorage.getItem("userId");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/auth/users/${id}`).then((res) => {
      setFormData({
        full_name: res.data.full_name,
        email: res.data.email,
      });
      if (res.data.profilePicUrl) {
        setPreview(`http://localhost:5000${res.data.profilePicUrl}`);
      } else {
        setFormData(res.data);
      }
      // setUser(data);
      if (res.data.profilePicUrl) {
        setPreview(`http://localhost:5000${res.data.profilePicUrl}`);
      }
    });
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

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
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

      console.log("Update Payload:", updatePayload);

      // Send update request
      await axios.put(
        `http://localhost:5000/api/auth/users/${id}`,
        updatePayload
      );
      setAlert({
        visible: true,
        title: "Profile updated ",
        message: "Your profile has been updated successfully.",
      });
      window.location.href = "/profile:id"; // redirect to profile
    } catch (err) {
      console.error("Error updating profile:", err);
      setAlert({
        visible: true,
        title: "Profile update failed",
        message: "Your profile could not be updated.",
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-red-900 via-slate-800 to-yellow-700 p-6 flex justify-center items-center text-white font-medium mt-14">
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
        className="bg-white bg-opacity-10 p-6 rounded-lg space-y-4 w-full max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-bold text-center">Edit Profile</h2>

        <div className="flex flex-col items-center space-y-2">
          <img
            src={preview}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-4 border-white"
          />
          <label className="cursor-pointer text-white text-sm font-bold text-center">
            📷 Change Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block mb-1 text-sm">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Phone number</label>
          <input
            type="tel"
            name="phone"
            value={formData.Phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 p-2 rounded font-semibold hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
