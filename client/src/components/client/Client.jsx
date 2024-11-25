import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'

const Client = () => {
  return (
    <div>
      <Navbar/>
      <div className='mt-16'>
      <Outlet />
      </div>
    </div>
  )
}

export default Client
