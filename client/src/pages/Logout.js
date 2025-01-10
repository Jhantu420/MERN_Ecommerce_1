import React from "react";
import { useDispatch } from "react-redux";
import { clearUserDetails } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        dispatch(clearUserDetails()); // Clear the user details from the redux
        toast.success("Logged out successfully");
        navigate("/sign-in");
      } else {
        toast.error("Logout failed");
      }
    })
    .catch((error)=>{
        console.log(error)
        toast.error('Logout error')
    });
  };
  return (
    <div className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded-md">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
