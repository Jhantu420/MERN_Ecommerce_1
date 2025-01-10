import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import EditUser from "./EditUser"; // Assuming EditUser component is in the same folder

function AllUsers() {
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/all-users")
      .then((res) => res.json())
      .then((result) => {
        setData(result.users);
      });
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
    setShowEditPopup(false);
  };

  const handleUpdate = (id, updatedUser) => {
    setData((prevData) =>
      prevData.map((user) =>
        user._id === id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const handleDeleteClick = (id) => {
    fetch(`http://localhost:4000/api/delete-user/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setData((prevData) => prevData.filter((user) => user._id !== id));
        } else {
          console.error("Failed to delete user");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
              Email
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
              Role
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
              Created Date
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-sm text-gray-700">{item.name}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{item.email}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{item.role}</td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <Moment format="YYYY/MM/DD">{item.createdAt}</Moment>
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteClick(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditPopup && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <EditUser
              user={selectedUser}
              onClose={handleClosePopup}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUsers;


// Key Steps of Invocation:
// User Fills the Form:

// In the EditUser popup, the user makes changes to the form fields (e.g., name, email, or role).
// User Submits the Form:

// The user clicks the Save Changes button in the EditUser form.
// This triggers the handleSubmit function defined in EditUser.
// handleSubmit Calls onUpdate:

// Inside the handleSubmit function in EditUser, the onUpdate prop (which is actually the handleUpdate function passed from AllUsers) is called, passing the id of the edited user and the updatedUser data.
// Example:

// javascript
// Copy code
// onUpdate(user._id, updatedUser);
// handleUpdate Gets Invoked in AllUsers:

// The onUpdate call in EditUser directly invokes the handleUpdate function in AllUsers, updating the data state with the new user information.
// Re-render:

// React re-renders AllUsers with the updated data, so the changes are immediately visible in the user table.
// Key Moment:
// The handleUpdate function is invoked as soon as the user submits the form in EditUser and the onUpdate function is called inside the handleSubmit handler.
