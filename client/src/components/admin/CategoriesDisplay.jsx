import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContextProvider';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import config from '../../../config';

const CategoriesDisplay = () => {
  const {categories,setCategories}=useContext(AppContext)
 const {api}=config
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isEditOpen,setIsEditOpen]=useState(false)
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setNewCategory({ name: '', description: '' }); // Reset the form
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim() && newCategory.description.trim()) {
      fetch(`${api}/categories`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("access_Token")}`
        },
        body:JSON.stringify(newCategory)
      })
      .then(res=>{
        if(res.ok){
          return res.json().then(data=>{
            setCategories((prev) => [...prev, data])
            toast.success("Product category added successfully.")
          })
        }else{toast.error(data.msg)}
      })
      ;
      setNewCategory({ name: '', description: '' });
      setIsSidebarOpen(false); // Close the sidebar
    } else {
      toast.error('Please fill out all fields.');
    }
  };
  
  function handleEditCategory(){
    if (newCategory.name.trim() && newCategory.description.trim()) {
      fetch(`${api}/category/${newCategory.id}`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("access_Token")}`
        },
        body:JSON.stringify(newCategory)
      })
      .then(res=>{
        if(res.ok){
          return res.json().then(data=>{
            let new_category=categories.map(item=>item.id===newCategory.id?{...item, ...data}:item)
            setCategories(new_category)
            toast.success("Product category updated successfully.")
          })
        }else{toast.error(data.msg)}
      })
      ;
      setNewCategory({ name: '', description: '' });
      setIsEditOpen(false); // Close the sidebar
    } else {
      toast.error('Please fill out all fields.');
    }
  }

  function handleDelete(id,name){
    Swal.fire({
      title: `Delete ${name} category?`,
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Cancel'
  }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/${id}`,{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${localStorage.getItem("access_Token")}`
          },
        })
        .then(res=>{
          if(res.ok){
            const updated_categories=categories.filter((item)=>item.id!==id)
            setCategories(updated_categories)
            Swal.fire({
              title:"Success!",
              text:'Category deleted successfully.',
              icon:'success',
              confirmButtonText: "OK"
          })
          }else{
            Swal.fire({
              title:"Failed!",
              text:'Deleting failed. Try again later.',
              icon:'warning',
              confirmButtonText: "OK"
          })
          }
        })
      }
  })}

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={handleToggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {categories.map((category, index) => (
    <div
      key={index}
      className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between h-full"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{category.name}</h3>
        <p className="text-sm text-gray-600 mt-2">{category.description}</p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex space-x-10 justify-start">
        {/* Edit Button */}
        <button
          onClick={() => { setIsEditOpen(true); setNewCategory({name:category.name,description:category.description,id:category.id}); }}
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
          onClick={() => handleDelete(category.id,category.name)}
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
  {categories.length === 0 && (
    <p className="text-gray-500 col-span-full text-center">
      No categories added yet.
    </p>
  )}
</div>


      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end z-50">
          <div className="w-80 bg-white p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add New Category</h3>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter category name"
            />
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={newCategory.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter category description"
              rows="3"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAddCategory}
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
            <h3 className="text-xl font-bold mb-4">Add New Category</h3>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter category name"
            />
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={newCategory.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter category description"
              rows="3"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleEditCategory}
                className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                Update
              </button>
              <button
                onClick={()=>setIsEditOpen(false)}
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

export default CategoriesDisplay;
