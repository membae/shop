import React, { createContext, useEffect, useState } from 'react'
import config from '../config'


export const AppContext=createContext()
const AppContextProvider = (props) => {
  const {api}=config
    const [userId,setUserId]=useState(localStorage.getItem("userId") || "")
    const [cartTotals,setCartTotals]=useState(localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")).length: 0)
    const [userData,setUserData]=useState({})
    const [cartItems,setCartItems]=useState(localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[]) //state to manage adding of items in the cart
    const [inCart,setInCart]=useState(false)
    const [categories,setCategories]=useState([])
    const [taxCategories,setTaxCategories]=useState([])
    const [products,setProducts]=useState([])
    const [allOrders,setAllOrders]=useState([])
    const [loginCheckout,setLoginCheckout]=useState(false) //state to manage loging in and proceed to checkout
    const [allUsers,setUsers]=useState([])
    const [filteredOrders, setFilteredOrders] = useState([]);
    
    //useefect to fetch user data once they are successfully logged in
    useEffect(()=>{
      fetch(`${api}/user/${userId}`,{
        method:"GET",
        headers:{
          "Authorization":`Bearer ${localStorage.getItem("access_Token")}`,
        },
      })
      .then(res=>res.json().then(data=>{
        if(res.ok){setUserData(data)}
        else{setUserData([])}
      }))
      
    },[userId])

    //useeffect to fetch product categories and tax categories
    useEffect(()=>{
      //fetch product categories
      fetch(`${api}/categories`)
      .then(res=>res.json())
      .then(data=>setCategories(data))
      //fetch tax categories
      fetch(`${api}/tax-category`)
      .then(res=>res.json())
      .then(data=>setTaxCategories(data))
      //fetch products
      fetch(`${api}/products`)
      .then(res=>res.json())
      .then(data=>setProducts(data))
    },[])

    //conditionally fetch orders only if the logged in user is an admin
    useEffect(()=>{
      if(userData.role==="Admin"){
        fetch(`${api}/orders`,{
        method:"GET",
        headers:{
          "Authorization":`Bearer ${localStorage.getItem("access_Token")}`,
        },
        })
        .then(res=>res.json())
        .then(data=>{
            setAllOrders(data)
            setFilteredOrders(data)
        })

        //fetch users
        fetch(`${api}/get-users`,{
          method:"GET",
        headers:{
          "Authorization":`Bearer ${localStorage.getItem("access_Token")}`,
        }
        })
        .then(res=>res.json())
        .then(data=>{
          let new_data=data.map((user)=>({...user,name:`${user.first_name} ${user.last_name}`}))
          setUsers(new_data)})
      }
    },[userData])
    // function responsible for adding an item to cart and persisting the data
    function cartManageFn(product){
        function addToCartFn(product){
            product.quantity=1
            JSON.parse(localStorage.getItem("cart")).find(item=>item.id===product.id)?
            setCartItems(cartItems.filter(item=>item.id!==product.id))
            :
            setCartItems([...cartItems,product])
            setInCart(true)
            addToSTore(product)
          }
          function addToSTore(product){
            cartItems.find(item=>item.id===product.id)?
            localStorage.setItem('cart',JSON.stringify(cartItems.filter(item=>item.id!==product.id))):
            localStorage.setItem('cart',JSON.stringify([...cartItems,product]))
            value.setCartTotals(JSON.parse(localStorage.getItem("cart")).length)
      
          }
        addToCartFn(product)
    }
    const value={
        cartTotals,setCartTotals,userData,setUserData,cartManageFn,cartItems,setCartItems,
        categories,setCategories,taxCategories,setTaxCategories,products,setProducts,setUserId,allOrders,setAllOrders,
        loginCheckout,setLoginCheckout,allUsers,setUsers,filteredOrders, setFilteredOrders
    }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
