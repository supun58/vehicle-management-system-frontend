import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("/default-profile.png");

  const id = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/users/${id}`
        );
        const data = res.data;
        console.log("User data:", data);
        //if account_status is Admin from res.data set user to data
        if (data.account_status === "Admin") {
          const newdata = {
            full_name: data.name,
            email: data.email,
            user_type: data.account_status,
            profilePicUrl: data.profilePicUrl,
          };
          if (data.profilePicUrl) {
            setPreview(`http://localhost:5000${data.profilePicUrl}`);
          }
          setUser(newdata);
        }
        //if account_status is not Admin from res.data set user to data
        else {
          setUser(data);
        }
        // setUser(data);

        if (data.profilePicUrl) {
          setPreview(`http://localhost:5000${data.profilePicUrl}`);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [id]);

  // 🚨 DELETE FUNCTION HERE
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/auth/users/${id}`
      );
      localStorage.clear(); // Clear saved session
      setAlert({
        visible: true,
        title: "Account Deleted",
        message:
          res.data?.message || "Your Account has been deleted successfully.",
      });
      navigate("/"); // Redirect to login or homepage
    } catch (error) {
      console.error("Delete failed:", error);
      setAlert({
        visible: true,
        title: "Delete Failed",

        message: res.data?.message || "Your account could not be deleted.",
      });
    }
  };

  return (
    <div className="-h-screen bg-gradient-to-br from-red-900 via-slate-800 to-yellow-700 p-6 flex justify-center items-center text-white font-medium mt-14">
      {alert.visible && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) =>
            setAlert((prev) => ({ ...prev, visible }))
          }
        />
      )}
      {user ? (
        <div className="bg-white bg-opacity-10 p-6 rounded-lg space-y-4 w-full max-w-md">
          {/* Profile Image */}
          <div className="flex flex-col items-center mt-4 mb-6">
            <img
              src={preview || "/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="space-y-6 px-4">
            <div className="border-b border-gray-300 pb-2">
              <p className="text-gray-500 text-sm"> Name</p>
              <p className="text-lg font-semibold">{user.full_name}</p>
            </div>

            <div className="border-b border-gray-300 pb-2">
              <p className="text-gray-500 text-sm">Email Address</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>

            <div className="border-b border-gray-300 pb-2">
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-lg font-semibold">{user.user_type}</p>
            </div>

            {!(user.account_status === "Admin") && (
              <div className="border-b border-gray-300 pb-2">
                <p className="text-gray-500 text-sm">Phone Number</p>
                <p className="text-lg font-semibold">{user.phone}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-3 mt-8">
            <a href="/edit-profile" className="w-1/2">
              <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-[#81353d] transition duration-300">
                Edit Profile
              </button>
            </a>
            <button
              onClick={handleDelete}
              className="w-1/2 py-2 bg-blue-400 text-white font-semibold rounded-lg shadow hover:bg-[#5c1d23] transition duration-300"
            >
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white mt-20">Loading user details...</p>
      )}
    </div>
  );
};

export default UserProfile;
