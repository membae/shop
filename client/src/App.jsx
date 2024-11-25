import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Dashboard from './components/admin/Dashboard'
import Admin from './components/admin/Admin'
import Ordermanagement from './components/admin/Ordermanagement'
import Client from './components/client/Client'
import DashboardClient from './components/client/Dashboard'
import ProductListing from './components/client/ProductListing'
import ProductCard from './components/client/ProductCard'
import Login from './components/Login'
import Signup from './components/Signup'
import Cart from './components/client/Cart'
import ProductManagement from './components/admin/Products'
import Footer from './components/Homepage/Footer'

import Checkout from './components/client/Checkout'

import AddProduct from './components/admin/AddProduct'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import MyOrders from './components/client/MyOrders'
import CategoriesDisplay from './components/admin/CategoriesDisplay'
import TaxCategoriesDisplay from './components/admin/Taxes'
import Users from './components/admin/Users'

// import ReviewForm from './components/ProductReview/Review form'

import ForgotPassword from './components/ForgotPassword'
import { AppContext } from './AppContextProvider'




const App = () => {
  const {userData}=useContext(AppContext)
  return (
    <div>
    <ToastContainer />
    {!userData.email && <Navbar />}
    {/* <Routes>
    <Route path='/' element={<Homepage />}/>

    </Routes> */}
    <div className='min-h-screen'>
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='/admin' element={<Admin />}>
        <Route path='ordermanagement' element ={<Ordermanagement/>}/>
        <Route path='dashboard' element={<Dashboard />}/>
        <Route path='products' element={<ProductManagement />}/>
        <Route path='add-product' element={<AddProduct />}/>
        <Route path='product-categories' element={<CategoriesDisplay />}/>
        <Route path='tax-categories' element={<TaxCategoriesDisplay />}/>
        <Route path='users' element={<Users />} />
      </Route>
      <Route path='/client' element={<Client />}>
        <Route path='dashboard' element={<DashboardClient />}/>
        <Route path='product-listings' element={<ProductListing />}/>
        <Route path='product/:id' element={<ProductCard />}/>
        <Route path='checkout' element={<Checkout />}/>
        <Route path='my-orders' element={<MyOrders />}/>
        {/* <Route path='product-review/:id' element={<ReviewForm/>}/> */}
      </Route>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/cart' element={<Cart />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
    </Routes>
    </div>

    </div>
  )
}

export default App
