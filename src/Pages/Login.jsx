import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const inputVal = async (data) => {
    const { email, password } = data;

    try {
      const response = await fetch(
        "https://notes-management-system-backend.vercel.app/api/auth/login",
        {
          method: "POST",
          credentials: "include", // required if using cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        // ✅ Store token
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }

        // ✅ Store user info
        if (responseData.user) {
          localStorage.setItem("user", JSON.stringify(responseData.user));
        }

        Swal.fire({
          title: "Login Successful!",
          text: "You are being redirected to Home...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        Swal.fire({
          title: "Login Failed!",
          text:
            responseData.message || "Invalid credentials, please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("❌ Error logging in:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-center">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit(inputVal)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-[#166534] rounded-lg hover:bg-[#149e49] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>

        <Link to="/Signup">
          <p className="text-sm pt-5 text-center text-gray-600">
            Don't have an account?{" "}
            <span className="text-blue-500 hover:underline">Sign up</span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
