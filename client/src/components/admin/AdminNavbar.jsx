import React, { useContext, useState } from "react";
import { AppContext } from "../../AppContextProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {userData,setUserData}=useContext(AppContext)
  const navigate=useNavigate()
  return (
<nav className="bg-gray-900 text-white flex-shrink-0 w-full sticky top-0 z-10">      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Brand Name */}
          <div className="text-3xl font-extrabold ml-64">
            <a href="#">Gizmo Galaxy</a>
          </div>

          {/* Logged In Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
              className="flex items-center px-3 py-1 text-gray-200 bg-gray-700 rounded focus:outline-none focus:ring focus:ring-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A10.97 10.97 0 0112 15c2.05 0 3.943.615 5.52 1.66M15 12a3 3 0 10-6 0 3 3 0 006 0zm-3-9a9 9 0 100 18 9 9 0 000-18z"
                />
              </svg>
              {userData.first_name?`${userData.first_name} ${userData.last_name}`:null}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-20 w-32 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-700">
                <ul>
                  <li>
                    <button
                      onClick={() => {navigate("/");localStorage.removeItem("access_Token");
                        localStorage.removeItem("refresh_Token");
                        localStorage.removeItem("userId");setUserData({})}}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-13v1m0 9h6m0-10h-6"
                        />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
