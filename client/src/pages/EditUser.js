import React, { useState } from "react";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast

function EditUser({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/api/edit-user/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message); // Show success toast
          onUpdate(user._id, formData); // Update the user data in parent component
          onClose(); // Close the popup
        } else {
          toast.error(result.message); // Show error toast
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Failed to update user."); // Show error toast
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-center">Edit User</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="general">General</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditUser;
