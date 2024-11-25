import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContextProvider";

const ProductListing = () => {
  const [searchWord, setSearchWord] = useState(""); //state to manage search bar content
  const [categoryWord, setCategoryWord] = useState(""); //state to manage category dropdown
  const [searchPrice, setSearchPrice] = useState(0);
  const [balance, setBalance] = useState(""); // state to hold balance
  const [earnings, setEarnings] = useState(""); // state to hold earnings
  const navigate = useNavigate();

  const value = useContext(AppContext);
  const allProducts = value.products;
  const products = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchWord.toLowerCase()) &&
      (categoryWord === "" || product.category.name === categoryWord) &&
      (searchPrice === 0 || searchPrice >= product.selling_price)
  );
  const addToCartFn = value.cartManageFn;

  useEffect(() => {
    // Get user ID from localStorage
    const userId = localStorage.getItem("userId");

    if (userId) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/user/${userId}`
          ); // Use the dynamic user ID
          const data = await response.json();
          setBalance(data.balance); // Set balance from the response
          setEarnings(data.earnings); // Set earnings from the response
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      fetchUserDetails();
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  const handleBuy = async (product) => {
    if (balance >= product.selling_price) {
      // Proceed with the purchase
      const newBalance = balance - product.selling_price;
      setBalance(newBalance);
      localStorage.setItem("balance", newBalance); // Update balance in localStorage

      // Optional: Update the backend with the new balance
      const userId = localStorage.getItem("userId");
      await fetch(`http://127.0.0.1:5000/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ balance: newBalance }),
      });

      // Add the product to the cart after purchase (optional)
      addToCartFn(product);
    } else {
      alert("Insufficient balance to complete the purchase");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for filters (visible on large screens) */}
      <div className="hidden lg:block w-1/4 p-4">
        <div className="bg-gray-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          {/* Add filter options here */}
          <div className="mb-4">
            <h3 className="font-medium">Color</h3>
            <ul className="space-y-2">
              <li>
                <input type="checkbox" /> Red
              </li>
              <li>
                <input type="checkbox" /> Blue
              </li>
              <li>
                <input type="checkbox" /> Black
              </li>
            </ul>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Min: 0</span>
              <span className="text-gray-700">Max: 100,000</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              value={searchPrice}
              onChange={(e) => setSearchPrice(parseInt(e.target.value))}
              className="w-full"
            />
            {searchPrice > 0 && (
              <p className="text-gray-700 mt-2">
                Selected Price: <span className="font-semibold">{searchPrice}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Sticky Top Bar: Search and Category Filter */}
        <div className="sticky top-0 bg-white z-10 p-4 shadow-md">
          <div>
            <h1>Balance: KSH {balance}</h1>
            <h1>Earnings: KSH {earnings}</h1>
          </div>
          <div className="flex justify-between items-center">
            {/* Search Bar */}
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
            </div>
            {/* Category Filter */}
            <div className="ml-4 w-1/2">
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={categoryWord}
                onChange={(e) => setCategoryWord(e.target.value)}
              >
                <option value="">All Categories</option>
                {value.categories.map((category) => (
                  <option key={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Products Section */}
        <div className="overflow-y-auto flex-1 mt-4">
          {products.length > 0 ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-120"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={product.image_url[0].image_url}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div
                    className="p-4 flex-grow cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/client/product/${product.id}`)}
                  >
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {product.description.length > 100
                        ? `${product.description.slice(0, 100)}...`
                        : product.description}
                    </p>
                  </div>

                  {/* Sticky Price */}
                  <div className="sticky bottom-16 bg-white">
                    <p className="mt-2 text-xl font-bold px-4">
                      KSH {product.selling_price}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="items-center mt-auto p-4">
                    {product.quantity > 0 ? (
                      <>
                        <button
                          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          onClick={() => addToCartFn(product)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          onClick={() => handleBuy(product)}
                        >
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow-md"
                        onClick={() => navigate(`/client/product/${product.id}`)}
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-red-500 mt-4">
              No products match what you're looking for.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
