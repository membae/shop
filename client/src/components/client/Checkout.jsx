/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContextProvider'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import config from '../../../config'

const Checkout = () => {
  const value = useContext(AppContext)
  const { api } = config
  const navigate = useNavigate()
  const userData = value.userData
  // State to hold cart items
  const [cartItems, setCartItems] = useState([])
  const [newOrder, setNewOrder] = useState({})
  const [checkoutRequestId, setCheckoutRequestId] = useState(null)

  //function to update the state of an order payment
  useEffect(() => {
    if (!checkoutRequestId) return

    const pollPaymentStatus = async () => {
      console.log('polling')
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/order/${newOrder.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_Token')}`,
            },
          }
        )
        const data = await response.json()
        console.log(data)
        if (data.payment_status === 'Failed') {
          clearInterval(pollInterval)
          console.log('Failed')
          Swal.fire({
            title: 'Payment Failed',
            text: 'Unfortunately, your payment could not be processed. Please try again later.',
            icon: 'error',
            didClose: () => {
              const my_data = value.userData
              my_data.orders.push(data)
              value.setUserData(my_data)
              localStorage.setItem('cart', JSON.stringify([]))
              value.setCartTotals(0)
              navigate('/client/my-orders')
            },
          })
          return
        }
        if (data.payment_status === 'Success') {
          clearInterval(pollInterval)
          console.log('Success')
          Swal.fire({
            title: 'Payment Successful!',
            text: 'Your payment has been confirmed and your order is complete.',
            icon: 'success',
            didClose: () => {
              const my_data = value.userData
              my_data.orders.push(data)
              value.setUserData(my_data)
              localStorage.setItem('cart', JSON.stringify([]))
              value.setCartTotals(0)
              navigate('/client/my-orders')
            },
          })
          return
        }
      } catch (err) {
        console.error('Error polling payment status:', err)
      }
    }

    const pollInterval = setInterval(pollPaymentStatus, 5000)
    return () => clearInterval(pollInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutRequestId])

  // Fetch cart items from local storage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cart')
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems))
    }
  }, [])

  // Calculate subtotal price
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.selling_price_excl_tax * item.quantity,
    0
  )
  const shippingFee = 0 //subtotal > 0 ? 200 : 0;
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.selling_price * item.quantity,
    0
  )
  const taxRate = 0.16 // Example tax rate (16%)

  // Calculate total with tax and shipping
  const taxAmount = totalPrice - subtotal
  // const totalPrice = subtotal + taxAmount + shippingFee;

  // State for shipping details
  const [shippingDetails, setShippingDetails] = useState({
    County: '',
    'city/town': '',
    'Street/Building Name': '',
    'phone number': '',
  })

  // Handle input changes
  const handleInputChange = (e, setDetails) => {
    const { name, value } = e.target
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }))
  }
  //function that joins the values of an object to return the shipping address
  function shipping_address() {
    let products = []
    for (let items in cartItems) {
      products.push({
        product_id: cartItems[items].id,
        quantity: cartItems[items].quantity,
      })
    }
    return {
      address: `${shippingDetails.County}, ${shippingDetails['Street/Building Name']}, ${shippingDetails['city/town']}`,
      products: products,
    }
  }
  // Check if all shipping fields are filled
  const isShippingComplete = Object.values(shippingDetails).every(
    (field) => field.trim() !== ''
  )
  const handlePlaceOrder = () => {
    if (isShippingComplete) {
      const orderObj = {
        amount: totalPrice,
        shipping_address: shipping_address().address,
        taxes: parseFloat(taxAmount.toFixed(2)),
        products: shipping_address().products,
        phone_number: shippingDetails['phone number'],
      }
      Swal.fire({
        title: `An MPESA prompt will be sent to ${shippingDetails['phone number']}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false, // Prevent closing while loading
        allowEscapeKey: false, // Prevent closing with Escape key
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Processing Payment...',
            text: 'Please wait while we process your payment.',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading()
              fetch(`${import.meta.env.VITE_BACKEND_URL}/payments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem(
                    'access_Token'
                  )}`,
                },
                body: JSON.stringify(orderObj),
              }).then((res) => {
                if (res.ok) {
                  return res.json().then((data) => {
                    console.log(data)
                    setNewOrder(data)
                    setCheckoutRequestId(data.payment[0].transaction_id)
                  })
                } else {
                  return res.json().then((data) => {
                    Swal.fire({
                      title: 'Payment Processing Failed',
                      text:
                        data.msg ||
                        'An error occurred while processing the payment.',
                      icon: 'error',
                      confirmButtonText: 'Try again later',
                    })
                  })
                }
              })
            },
          })
        }
      })

      // .then(res=>{
      //   return res.json().then(data=>console.log(data))
      //   // if(res.ok){
      //   //   return res.json().then(data=>{

      //   //   })
      //   // }else{return res.json().then(data=>toast.error(data.msg))}
      // })
    } else {
      toast.error('Please fill in all fields before placing the order.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        {cartItems.length > 0 ? (
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>
                  KSH {(item.selling_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KSH {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (16%)</span>
              <span>KSH {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>KSH {shippingFee.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>KSH {totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">No items in the cart.</p>
        )}
      </div>

      {/* Shipping Details */}
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
        {value.userData && (
          <div className=" bg-gray-100 rounded-md ">
            <label className="block text-gray-700 font-semibold text-lg capitalize mb-1">
              Name
            </label>
            <p className="text-gray-900 text-xl font-medium">
              {userData.first_name} {userData.last_name}
            </p>
            <br />
          </div>
        )}
        <form className="space-y-2">
          <div>
            <label className="block font-medium capitalize">County</label>
            <input
              type="text"
              name="County"
              value={shippingDetails['County']}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-medium capitalize">City/Town</label>
            <input
              type="text"
              name="city/town"
              value={shippingDetails['city/town']}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-medium capitalize">
              Street/Building Name
            </label>
            <input
              type="text"
              name="Street/Building Name"
              value={shippingDetails['Street/Building Name']}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-medium capitalize">Phone Number</label>
            <input
              type="number"
              name="phone number"
              placeholder="07XXXXXXXX"
              value={shippingDetails['phone number']}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </form>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="w-full py-2 bg-green-500 text-white font-semibold rounded-md mt-4"
        // disabled={cartItems.length === 0 || !isShippingComplete}
      >
        Place Order
      </button>
    </div>
  )
}

export default Checkout