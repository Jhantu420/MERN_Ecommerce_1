import React, { useState } from "react";
import loginIcons from "../assest/signin.gif";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => password.length >= 6;
  const nevigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for errors
    const newErrors = {};
    if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address!";
    }

    if (!validatePassword(data.password)) {
      newErrors.password = "Password must be at least 6 characters long!";
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    // Update error state
    setErrors(newErrors);

    // Exit if there are errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    fetch(process.env.REACT_APP_BACKEND_URL + "/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Sign-up successful!");
          console.log("Form submitted successfully:", res);

          // Clear form data
          setData({
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
          });

          nevigate("/sign-in");
        } else {
          toast.error("Sign-up failed. Please try again.");
        }
      })
      .catch((error) => {
        toast.error("An error occurred during sign-up. Please try again.");
        console.error("Error:", error.message);
      });
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 py-5 w-full max-w-md mx-auto rounded-3xl shadow-2xl">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login Icon" className="rounded-full" />
          </div>
          <form action="" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid">
              <label htmlFor="">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full h-full outline-none bg-slate-100 p-2 rounded-sm"
                required
              />
            </div>
            <div className="grid">
              <label htmlFor="">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full h-full outline-none bg-slate-100 p-2 rounded-sm"
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="grid">
              <label htmlFor="">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full h-full outline-none bg-slate-100 p-2 rounded-sm"
                required
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="grid">
              <label htmlFor="">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={data.confirmPassword}
                onChange={(e) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
                className="w-full h-full outline-none bg-slate-100 p-2 rounded-sm"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button className="bg-red-600 text-white p-2 m-2 w-full max-w-40 rounded-3xl hover:scale-110 transition-all mx-auto block">
              Sign Up
            </button>
          </form>
          <p className="py-4">
            Already have an account?{" "}
            <Link
              to={"/sign-in"}
              className="hover:text-red-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
