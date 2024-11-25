
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { AppContext } from '../AppContextProvider';

const Navbar = () => {
  const navigate=useNavigate()
  const value=useContext(AppContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered,setIsHovered]=useState(false) //state to manage the hovering effect functionality

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <nav className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50" onMouseLeave={() => setIsHovered(false)}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">

        <div className="lg:text-2xl sm:text-xl font-bold text-white absolute lg:left-8 sm:left-0" onClick={()=>{navigate('/')}}>
            Amazon
          </div>

          {localStorage.getItem('userId')&&value.userData.role==="Client"&&
          <div className="hidden md:flex flex-grow justify-center items-center space-x-20 md:space-x-6">
            <Link to="/" className="hover:text-gray-400">Daily Deals</Link>
            <Link to="/client/product-listings" className="hover:text-gray-400">Products</Link>
            <Link to="/" className="hover:text-gray-400">Hot & New</Link>
            <Link to="/" className="hover:text-gray-400">Support</Link>
          </div>}

          {!value.userData.email &&
            <div className="hidden md:flex flex-grow justify-center items-center space-x-20 md:space-x-6">
            <Link to="/" className="hover:text-gray-400">Daily Deals</Link>
            <Link to="/client/product-listings" className="hover:text-gray-400">Products</Link>
            <Link to="/" className="hover:text-gray-400">Hot & New</Link>
            <Link to="/" className="hover:text-gray-400">Support</Link>
          </div>
          }

 
          {localStorage.getItem('userId')&&value.userData.role==="Admin" && <div className="hidden sm:flex flex-grow justify-center items-center space-x-20">
            <Link to="/" className="hover:text-gray-400">Dashboard</Link>
            <Link to="/admin/products" className="hover:text-gray-400">Products</Link>
            <Link to="/admin/ordermanagement" className="hover:text-gray-400">Orders</Link>
            <Link to="/" className="hover:text-gray-400">Reports & Analytics</Link>
          </div>}

          {
           !(localStorage.getItem('userId')&&value.userData.role==="Admin") &&
          <div className="flex items-center justify-end space-x-4 sm:space-x-6 md:space-x-10 w-full sm:w-auto">
            <Link to="/cart" className="relative hover:text-gray-400">
              <FaShoppingCart className="text-xl" />
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {value.cartTotals} 
              </span>
            </Link>
            <button to="/" className="hover:text-gray-400" onMouseEnter={()=>setIsHovered(true)} onClick={()=>setIsHovered(false)}>
              <FaUser />
            </button>
            {isHovered && (
              <div className="absolute top-16 right-2 w-60 bg-gray-800 border border-gray-600 shadow-md rounded-xl p-4">
                {/* navbar status when logged out */}
              {(!value.userData.email)&&<><Link 
                to='/login' 
                className="block text-white font-medium cursor-pointer hover:text-blue-400 hover:bg-gray-700 py-2 px-3 rounded-lg transition-colors duration-200" 
                onClick={() => setIsHovered(false)}
              >
                Login
              </Link>
              <Link 
                to='/signup' 
                className="block text-white font-medium cursor-pointer hover:text-blue-400 hover:bg-gray-700 py-2 px-3 rounded-lg transition-colors duration-200 mt-2" 
                onClick={() => setIsHovered(false)}
              >
                Signup
              </Link></>}
              {/* navbar status when logged in */}
              {localStorage.getItem('userId')&&value.userData.role==="Client"&&(<>
              <Link 
                to='/client/my-orders' 
                className="block text-white font-medium cursor-pointer hover:text-blue-400 hover:bg-gray-700 py-2 px-3 rounded-lg transition-colors duration-200" 
                onClick={() => setIsHovered(false)}
              >
                My Orders
              </Link>
              
              <Link 
                to='/login' 
                className="block text-white font-medium cursor-pointer hover:text-blue-400 hover:bg-gray-700 py-2 px-3 rounded-lg transition-colors duration-200" 
                onClick={() => setIsHovered(false)}
              >
                Product Reviews
              </Link>
              <Link 
                to='/' 
                className="block text-white font-medium cursor-pointer hover:text-blue-400 hover:bg-gray-700 py-2 px-3 rounded-lg transition-colors duration-200 mt-2" 
                onClick={() => {setIsHovered(false);localStorage.removeItem("cart");localStorage.setItem('cart',JSON.stringify([]));value.setCartTotals(0);localStorage.removeItem('userId');
                  localStorage.removeItem("access_Token");localStorage.removeItem("refresh_Token");value.setUserData([]);value.setLoginCheckout(false);value.setCartTotals(0)
                }}
              >
                Logout
              </Link></>)}
            </div>
            )}
            <button className="md:hidden" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>}

          {localStorage.getItem('userId')&&value.userData.role==="Admin" &&
            <div className="flex items-center justify-end space-x-4 sm:space-x-6 md:space-x-10 w-full sm:w-auto">
               {/* <Link to="/" className="hover:text-gray-400">Profile</Link> */}
               <Link to="/login" className="hover:text-gray-400"
               onClick={() => {setIsHovered(false);localStorage.setItem('cart',JSON.stringify([]));value.setCartTotals(0);localStorage.removeItem('userId');
                localStorage.removeItem("access_Token");localStorage.removeItem("refresh_Token");value.setUserData([])
              }}
               >Logout</Link>
            </div>

          }
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 text-center">
            <Link to="/" className="block py-2 hover:text-gray-400">Daily Deals</Link>
            <Link to="/client/product-listings" className="block py-2 hover:text-gray-400">Products</Link>
            <Link to="/" className="block py-2 hover:text-gray-400">Hot & New</Link>
            <Link to="/" className="block py-2 hover:text-gray-400">Support</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
