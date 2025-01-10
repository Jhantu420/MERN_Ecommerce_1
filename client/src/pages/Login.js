import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [data, setData] = useState({
    email: "priyanka@gmail.com",
    password: "password",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Invalid email or password");
        }
        return res.json();
      })
      .then(async () => {
        toast.success("Sign-In successful!");
        setData({ email: "", password: "" });
        // Fetch user details after successful login
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/api/user-details",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const userDetails = await response.json();
        // console.log(userDetails.user);
        if (userDetails.success) {
          dispatch(setUserDetails(userDetails.user)); // Update Redux store
        }

        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to login");
        console.error("Error:", err);
      });
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4 ">
        <div className="bg-white p-5 py-5 w-full max-w-md mx-auto rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full outline-none bg-slate-100 p-2 rounded-sm"
                required
              />
            </div>
            <div className="grid">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full outline-none bg-slate-100 p-2 rounded-sm"
                required
              />
            </div>
            <div>
              <Link
                to="/forget-password"
                className="hover:text-red-500 hover:underline flex justify-end p-2"
              >
                Forgot password?
              </Link>
            </div>
            <button className="bg-red-600 text-white p-2 m-2 w-full max-w-40 rounded-3xl hover:scale-110 transition-all mx-auto block">
              Login
            </button>
          </form>
          <p className="py-4">
            Don't have an account?{" "}
            <Link to="/sign-up" className="hover:text-red-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
