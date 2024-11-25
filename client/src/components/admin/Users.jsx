import React, { useContext, useState } from "react";
import { FaTrash, FaUserSlash, FaPlus, FaCheckCircle } from "react-icons/fa";
import { AppContext } from "../../AppContextProvider";
import config from "../../../config";
import { toast } from "react-toastify";

const usersData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "User" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Admin" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", role: "User" },
  { id: 4, name: "Bob Brown", email: "bob.brown@example.com", role: "Admin" },
];

const UsersAdminsTable = () => {
  const {allUsers,setUsers}=useContext(AppContext)
  const {api}=config
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  // const [users, setUsers] = useState(usersData);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", password: "", role: "User" });
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAction = (id, action) => {
    
    if (action === "delete") {
      console.log(id)
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } else if (action === "Suspend" || action==="Activate") {
      fetch(`${api}/user/${id}`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("access_Token")}`,
        },
        body:JSON.stringify({"status":`${action}ed`})
      })
      .then(res=>{
        if(res.ok){
          return res.json().then(data=>{
            data["name"]=`${data.first_name} ${data.last_name}`
            const newUser=allUsers.map((user)=>user.id===id?{...user,...data}:user)
            setUsers(newUser)
            toast.success("User status updated successfully")
          })
        }else{
          return res.json().then(data=>toast.error(data.msg))
        }
      })
    }
  };
  const handleAddUser = (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password, role } = newUser;

    if (!first_name || !last_name || !email || !password) {
      alert("All fields are required!");
      return;
    }

    setNewUser({ first_name: "", last_name: "", email: "", password: "", role: "User" });
    setShowAddUserForm(false);
  };
  const filteredUsers = allUsers.filter(
    (user) =>
      (filter === "All" || user.role === filter) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <select
            className="p-2 border border-gray-300 rounded"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="User">Client</option>
            <option value="Admin">Admins</option>
          </select>

          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600 transition-all"
          >
            <FaPlus className="text-lg" /> Add User
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name or email"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Add User Form */}
      {showAddUserForm && (
        <form className="mb-6 bg-white p-4 rounded shadow" onSubmit={handleAddUser}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-2 border border-gray-300 rounded"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-2 border border-gray-300 rounded"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border border-gray-300 rounded"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 border border-gray-300 rounded"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <select
              className="p-2 border border-gray-300 rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.role}</td>
                  <td className="px-6 py-3">
                    {user.role === "Admin" && (
                      <div className="flex gap-2">
                        <button
                            className="flex items-center px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                        >
                            <span className="mr-1">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 3.487l3.651 3.651m-8.042 8.042L5.91 20.738a2.121 2.121 0 01-2.121 0l-2.121-2.121a2.121 2.121 0 010-2.121l8.042-8.042m10.733-3.01a2.121 2.121 0 00-3.01 0l-1.52 1.52 3.651 3.65 1.52-1.519a2.121 2.121 0 000-3.01z"
                        />
                        </svg>
                    </span>
                            Edit
                        </button>
                        <button
                            className="flex items-center px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                        >
                            <span className="mr-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            </span>
                            Delete
                        </button>
                        <button
                          onClick={() => handleAction(user.id, user.status==="Suspended"?"Activate":"Suspend")}
                          className={`flex items-center px-2 py-1 ${user.status==="Suspended"?"bg-green-500 hover:bg-green-600":"bg-yellow-500 hover:bg-yellow-600"} text-white text-sm rounded  transition`}
                        >
                          <span className="mr-1">
                            {user.status==="Suspended"?<FaCheckCircle className="w-5 h-5"/>:<FaUserSlash className="w-5 h-5" />}
                          </span>
                          {user.status==="Suspended"?"Activate":"Suspend"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersAdminsTable;
