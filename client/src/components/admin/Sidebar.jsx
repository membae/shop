import React, { useState } from "react";
import { 
  FaBox, FaUser, FaUsers, FaChartBar, FaClipboardList, FaTags, 
  FaFileInvoiceDollar
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside
  className={`min-h-screen ${
    isCollapsed ? "w-16 items-center" : "w-64"
  } bg-gray-900 text-white fixed top-0 left-0 z-20 transition-all duration-300 shadow-md flex flex-col`}
>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isCollapsed ? "hidden" : ""}`}>
          Admin Dashboard
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isCollapsed ? "☰" : "✕"}
        </button>
      </div>
      <nav className={`flex-grow p-4 overflow-y-auto ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        <ul className={`${isCollapsed ? "space-y-8" : "space-y-2"}`}>
        <li className={`${isCollapsed ? "flex justify-center" : ""} flex items-center gap-2 hover:bg-gray-700 p-3 rounded transition duration-200`}>
          <MdDashboard className="text-xl" />
          {!isCollapsed && <Link to='/admin/dashboard'>Dashboard</Link>}
          </li>
          {/* Products */}
          <li className={`${isCollapsed ? "flex justify-center" : ""} flex items-center gap-2 hover:bg-gray-700 p-3 rounded transition duration-200`}>
          <FaBox className="text-xl" />
          {!isCollapsed && <Link to='/admin/products'>Products</Link>}
          </li>

          {/* Users */}
          <li className={`${isCollapsed ? "flex justify-center" : ""} flex items-center gap-2 hover:bg-gray-700 p-3 rounded transition duration-200`}>
          <FaUsers className="text-xl" />
          {!isCollapsed && <Link to='/admin/users'>Users</Link>}
          </li>

          {/* Categories */}
          <li className={`${isCollapsed ? "flex justify-center" : ""} flex items-center gap-2 hover:bg-gray-700 p-3 rounded transition duration-200`}>
          <FaTags className="text-xl" />
          {!isCollapsed && <Link to='/admin/product-categories'>Categories</Link>}
          </li>

          <li className={`${isCollapsed ? "flex justify-center" : ""} flex items-center gap-2 hover:bg-gray-700 p-3 rounded transition duration-200`}>
            <FaFileInvoiceDollar className="text-xl" />
            {!isCollapsed && <Link to="/admin/tax-categories" className="block">Taxes</Link>}
          </li>
          {/* Analytics */}
          {/* <li className={`${isCollapsed ? "flex justify-center" : ""} flex items-center gap-2 hover:bg-gray-700 p-3 rounded transition duration-200`}>
            <FaChartBar className="text-xl" />
            {!isCollapsed && <a href="/admin/analytics" className="block">View Analytics</a>}
          </li> */}

          {/* Orders */}
          <li className={`${isCollapsed ? "flex justify-center" : ""}`}>
          <li className={`${isCollapsed ? "flex justify-center" : ""} flex items-center gap-2 hover:bg-gray-700 p-3 rounded transition duration-200`}>
            <FaClipboardList className="text-xl" />
            {!isCollapsed && <a href="/admin/ordermanagement" className="block">Orders</a>}
          </li>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;