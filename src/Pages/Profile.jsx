import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Profile = () => {
  const [user, setUser] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
      setUser(data);
      reset(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Error", "Please login first", "error");
    return;
  }

  const form = new FormData();
  form.append("name", formData.name);
  form.append("phoneNumber", formData.phoneNumber);
  if (formData.profilePicture?.[0]) {
    form.append("profilePicture", formData.profilePicture[0]);
  }

  // Debug: log all form data entries
  for (let pair of form.entries()) {
    console.log(pair[0] + ": ", pair[1]);
  }

  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type when sending FormData
      },
      body: form,
    });

    const data = await res.json();
    console.log("Profile update response:", data);

    if (res.ok) {
      Swal.fire("Success", "Profile updated successfully", "success");
      fetchProfile(); // Refresh profile data
    } else {
      Swal.fire("Error", data.message || "Failed to update profile", "error");
    }
  } catch (err) {
    console.error("Update Error:", err);
  }
};


  const handlePasswordChange = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "Please login first", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Password changed successfully", "success");
        setValue("oldPassword", "");
        setValue("newPassword", "");
      } else {
        Swal.fire("Error", result.message || "Failed to change password", "error");
      }
    } catch (error) {
      console.error("Password Change Error:", error);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      {user.profilePicture && (
        <div className="flex justify-center mb-4">
          <img
            src={`http://localhost:5000/${user.profilePicture}`}
            alt="Profile"
            className="w-28 h-28 rounded-full "
          />
        </div>
      )}

      <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            {...register("phoneNumber")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            value={user.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Update Profile Picture</label>
          <input
            type="file"
            {...register("profilePicture")}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Update Profile
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Change Password</h3>
        <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
          <div>
            <label>Old Password</label>
            <input
              type="password"
              {...register("oldPassword", { required: true })}
              className="w-full p-2 border rounded"
            />
            {errors.oldPassword && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              {...register("newPassword", { required: true })}
              className="w-full p-2 border rounded"
            />
            {errors.newPassword && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;


