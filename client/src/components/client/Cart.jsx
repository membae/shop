import { useContext, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContextProvider';

const Cart = () => {
  const navigate = useNavigate();
 const value=useContext(AppContext)

  const [items, setItems] = useState(localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")): []);

  const handleQuantityChange = (id, amount) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + amount } : item
    ));
    localStorage.setItem('cart',JSON.stringify(items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + amount } : item
    )))
  };

  const handleDelete = (id) => {
    localStorage.setItem('cart',JSON.stringify(items.filter(item => item.id !== id)))
    setItems(items.filter(item => item.id !== id));
    value.setCartTotals(value.cartTotals-1)
  };

  // Calculate total price
  const totalPrice = items.reduce((acc, item) => acc + (item.selling_price * item.quantity), 0);
  return (
    <div className="flex flex-col lg:flex-row ml-10 mr-10">
      {/* Cart List Section */}
      <div className="w-full lg:w-3/4 p-4">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex bg-white shadow-md rounded-lg p-4">
                {/* Product Image */}
                <div className="w-1/4 mr-4">
                  <img src={item.image_url[0].image_url} alt={item.name} className="w-full h-32 object-cover rounded-md" />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>

                  <div className="flex items-center space-x-2">
                    {/* Quantity Section */}
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-2 py-1 bg-gray-300 rounded-md"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="w-16 text-center border rounded-md"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-2 py-1 bg-gray-300 rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete Icon and Total Price */}
                <div className="flex flex-col items-end">
                  <FaTrash
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 cursor-pointer mb-2"
                  />
                  <p className="text-lg font-bold">KSH {(item.selling_price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-center text-red-500'>Cart is empty. Select products to purchase...</p>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="w-full lg:w-1/4 p-4 bg-gray-100 rounded-lg mt-4 lg:mt-0">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Items</span>
            <span className="font-semibold">{items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Price</span>
            <span className="font-semibold">KSH {totalPrice.toFixed(2)}</span>
          </div>
        </div>
        {value.userData.email?<button
          onClick={() => navigate('/client/checkout')}
          className="mt-4 w-full py-2 bg-green-500 text-white font-semibold rounded-md"
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </button>:
        <button
        onClick={() => {value.setLoginCheckout(true);navigate('/login')}}
        className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-md"
        disabled={items.length === 0}
      >
        Login to Checkout
      </button>
        }
      </div>
    </div>
  );
};

export default Cart;
