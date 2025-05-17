import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateNote = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          title: "Unauthorized!",
          text: "No token found. Please log in again.",
          icon: "error",
        });
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://notes-management-system-backend.vercel.app/api/notes/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            visibility: data.visibility,
            tags: data.tags.split(",").map((tag) => tag.trim()), // Split tags by comma and trim any extra spaces
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Note Created!",
          text: "Your note has been saved successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        reset();
      } else {
        Swal.fire({
          title: "Failed!",
          text: result.message || "Could not create note.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error creating note:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create New Note
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="Enter note title"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Title is required</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Write your note description here..."
              rows={6}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">Description is required</p>
            )}
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              {...register("tags")}
              placeholder="Enter tags, separated by commas"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Visibility Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Visibility
            </label>
            <select
              {...register("visibility", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select visibility</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="custom">Custom</option>
            </select>
            {errors.visibility && (
              <p className="text-red-500 text-sm">Visibility is required</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-lg transition duration-300"
          >
            Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
