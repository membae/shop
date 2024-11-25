import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContextProvider';
import config from '../../../config';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const navigate = useNavigate();
  const {api}=config
  const { categories, products,setProducts } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // Manage selected product for detail view
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Manage sidebar visibility


  // Filter products based on category and search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || product.category.name === selectedCategory)
  );
  const handleViewProduct = (e,id) => {
    if(e.target.value==="View"){
    setIsSidebarOpen(true)
    let product=products.filter((product)=>product.id===id)
    setSelectedProduct(product[0]);
    }
    if(e.target.value==="Delete"){
      Swal.fire({
        title: `Delete product?`,
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel'
      })
      .then((result) => {
          if (result.isConfirmed) {
            fetch(`${api}/product/${id}`,{
              method:"DELETE",
              headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("access_Token")}`
              }
            })
            .then(res=>{
              if(res.ok){
                let newProducts=products.filter((product)=>product.id!==id)
                setProducts(newProducts)
                toast.success("Product deleted successfully")
              }else{
                return res.json().then(data=>toast.error(data.msg))
              }
            })
          }
      })
  }}

  return (
    <div className="flex" >
    <div className={`p-4 ${isSidebarOpen?"w-[calc(100%-24rem)]":"w-full"}`} >
      {/* Controls for adding, searching, and filtering */}
      <div className="flex justify-between items-center  sticky top-0 bg-white z-10 p-4 shadow-md rounded-md">
        <button
          className="bg-green-500 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-green-600"
          onClick={() => navigate('/admin/add-product')}
        >
          Add Product
        </button>
  
        <div className="flex space-x-4 w-full">
          <input
            type="text"
            placeholder="Search products"
            className="border px-4 py-2 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border px-4 py-2 rounded-md w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => {
              return (
                <option value={category.name} key={category.name}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
  
      {/* Product Table */}
      <div className="overflow-auto max-h-[calc(100vh-150px)] mt-4 shadow-md rounded-md border">
        <table className="w-full border-collapse bg-white">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="p-4 text-center">Actions</th>
              <th className="p-4 text-center">Product Name</th>
              <th className="p-4 text-center">Unit Purchase Price</th>
              <th className="p-4 text-center">Unit Selling Price</th>
              <th className="p-4 text-center">Current Stock</th>
            </tr>
          </thead>
          <tbody >
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-center">
                  <select
                    className="border px-2 py-1 rounded-md w-auto max-w-xs"
                    onChange={(e) => handleViewProduct(e, product.id)}
                  >
                    <option>Actions</option>
                    <option>View</option>
                    <option>Edit</option>
                    <option>Delete</option>
                    <option>Add/Edit Stock</option>
                  </select>
                </td>
                <td className="p-4 text-center">{product.name}</td>
                <td className="p-4 text-center">KSH {product.purchase_price.toFixed(2)}</td>
                <td className="p-4 text-center">KSH {product.selling_price.toFixed(2)}</td>
                <td className="p-4 text-center">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
    {/* Sidebar for Product Details */}
    {isSidebarOpen && selectedProduct && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end top-16">
        <div className="bg-white w-96 h-full p-6 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4">
            <button
              className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 4.293a1 1 0 00-1.414 1.414L9.586 9H3a1 1 0 100 2h6.586l-3.293 3.293a1 1 0 001.414 1.414l5-5a1 1 0 000-1.414l-5-5z" clipRule="evenodd" />
                </svg>
              </span>
              Back
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <div className="space-y-4">
            <p><strong>Product Name:</strong> {selectedProduct.name}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Category:</strong> {selectedProduct.category.name}</p>
            <p><strong>Unit Purchase Price:</strong> KSH {selectedProduct.purchase_price}</p>
            <p><strong>Unit Selling Price:</strong> KSH {selectedProduct.selling_price}</p>
            <p><strong>Stock Quantity:</strong> {selectedProduct.quantity}</p>
          </div>

                  </div>
                </div>
              )}
  </div>
  
  );
};

export default ProductManagement;
