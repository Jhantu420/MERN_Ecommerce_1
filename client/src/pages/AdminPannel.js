import React, { useEffect, useState } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa"; // Importing icons
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";

function AdminPannel({ userDetails }) {
  const [isNavVisible, setIsNavVisible] = useState(false); // State to toggle navigation visibility
  const navigate = useNavigate();
  const toggleNav = () => {
    setIsNavVisible((prev) => !prev);
  };

  // useEffect(() => {
  //   if(userDetails.role !== "admin"){
  //     navigate("/")
  //   }
  // },[userDetails]);

  return (
    <div className="min-h-screen bg-red-200 flex">
      <aside
        className={`bg-white h-screen w-60 fixed md:static transition-transform duration-300 ${
          isNavVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ boxShadow: "5px 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="h-32 bg-red-500 flex justify-center items-center flex-col">
          <FaUserCircle className="text-white text-5xl mb-2" />{" "}
          {/* User icon */}
          <p className="text-white text-lg font-semibold">
            {userDetails ? userDetails.name : "No user found"}
          </p>
          <p className="text-white text-sm font-semibold">
            {userDetails ? userDetails.role : "No user found"}
          </p>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col items-center gap-6 p-6">
          <Link
            to="all-users"
            className="hover:bg-red-200 w-full text-center py-2 rounded-md transition duration-200"
            onClick={toggleNav}
          >
            All Users
          </Link>
          <Link
            to="all-products"
            className="hover:bg-red-200 w-full text-center py-2 rounded-md transition duration-200"
            onClick={toggleNav}
          >
            All Products
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-white ml-0">
        <div className="md:hidden flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={toggleNav} aria-label="Toggle navigation">
            <FaBars className="text-2xl text-red-500" />
          </button>
        </div>
        <Outlet /> {/* Placeholder for nested routes */}
      </main>
    </div>
  );
}

export default AdminPannel;
