import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContextProvider';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import config from '../../../config';

const TaxCategoriesDisplay = () => {
  const {taxCategories,setTaxCategories}=useContext(AppContext)
  const {api}=config
  const value = useContext(AppContext);

  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newTaxCategory, setNewTaxCategory] = useState({ name: '', value: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setNewTaxCategory({ name: '', value: '' }); // Reset the form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTaxCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTaxCategory = () => {
    if (newTaxCategory.name.trim() && newTaxCategory.value.trim()) {
      fetch(`${api}/tax-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_Token")}`
        },
        body: JSON.stringify(newTaxCategory)
      })
        .then(res => {
          if (res.ok) {
            return res.json().then(data => {
              setTaxCategories((prev) => [...prev, data]);
              toast.success("Tax category added successfully.");
            });
          } else { 
            res.json().then(data => toast.error(data.msg));
          }
        });
      setNewTaxCategory({ name: '', value: '' });
      setIsSidebarOpen(false); // Close the sidebar
    } else {
      toast.error('Please fill out all fields.');
    }
  };

  function handleEditTaxCategory() {
    if (newTaxCategory.name.trim() && newTaxCategory.value.trim()) {
      fetch(`${api}/tax-category/${newTaxCategory.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_Token")}`
        },
        body: JSON.stringify(newTaxCategory)
      })
        .then(res => {
          if (res.ok) {
            return res.json().then(data => {
              let updatedTaxCategories = taxCategories.map((item)=>item.id===newTaxCategory.id?{...item, ...data}:item);
              setTaxCategories(updatedTaxCategories);
              toast.success("Tax category updated successfully.");
            });
          } else {
            res.json().then(data => toast.error(data.msg));
          }
        });
      setNewTaxCategory({ name: '', value: '' });
      setIsEditOpen(false); // Close the sidebar
    } else {
      toast.error('Please fill out all fields.');
    }
  }

  function handleDelete(id, name) {
    Swal.fire({
      title: `Delete ${name} tax category?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/tax-category/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_Token")}`
          },
        })
          .then(res => {
            if (res.ok) {
              let newtaxCategories=taxCategories.filter((item)=>item.id!==id)
              setTaxCategories(newtaxCategories);
              Swal.fire({
                title: "Success!",
                text: 'Tax category deleted successfully.',
                icon: 'success',
                confirmButtonText: "OK"
              });
            } else {
              Swal.fire({
                title: "Failed!",
                text: 'Deleting failed. Try again later.',
                icon: 'warning',
                confirmButtonText: "OK"
              });
            }
          });
      }
    });
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tax Categories</h2>
        <button
          onClick={handleToggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Add Tax Category
        </button>
      </div>

      {/* Tax Categories List */}
      <div className="grid grid-c.ols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxCategories.map((category, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between h-full"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-2">Rate: {category.value}%</p>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex space-x-10 justify-start">
              {/* Edit Button */}
              <button
                onClick={() => { setIsEditOpen(true); setNewTaxCategory({ name: category.name, value: category.value, id: category.id }); }}
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

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(category.id, category.name)}
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
            </div>
          </div>
        ))}
        {taxCategories.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No tax categories added yet.
          </p>
        )}
      </div>

      {/* Sidebar for Adding or Editing Tax Category */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end z-50">
          <div className="w-80 bg-white p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add New Tax Category</h3>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newTaxCategory.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter category name"
            />
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Rate (%) 
            </label>
            <input
              type="number"
              name="value"
              value={newTaxCategory.value}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter tax rate"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAddTaxCategory}
                className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={handleToggleSidebar}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end z-50">
          <div className="w-80 bg-white p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Tax Category</h3>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newTaxCategory.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter category name"
            />
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Rate (%)
            </label>
            <input
              type="number"
              name="value"
              value={newTaxCategory.value}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter tax rate"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleEditTaxCategory}
                className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                Update
              </button>
              <button
                onClick={() => setIsEditOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCategoriesDisplay;
