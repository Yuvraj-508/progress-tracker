import React from "react"
import { NavLink } from "react-router-dom"
import { useAppContext } from "../Context/Context";
export default function Navbar() {
  const {user,setUser,axios,toast,navigate,handleLogout} = useAppContext();

  return (
    
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between ">
     
      <NavLink to='/' className="text-xl font-bold text-blue-600 hover:text-blue-800">
        Home
      </NavLink>

      
      <div className="hidden md:flex items-center space-x-4">
        <NavLink to='/task' className=" bg-white text-blue-600 px-4 py-2 rounded-lg">
          Task

        </NavLink>
    
       
        <NavLink to='/upload' className="bg-white text-blue-600 px-4 py-2 rounded-lg ">
          Upload
        </NavLink>

        <NavLink to='/progress' className="bg-white text-blue-600 px-4 py-2 rounded-lg  ">

         Progress
        </NavLink>
      </div>

     {!user ? (
    <NavLink to='/login' className="border bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg ">
       Login
      </NavLink>
     ):
     (
      <NavLink onClick={handleLogout} className="border bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg ">
       Logout
      </NavLink>
     )}
     

      
    </nav>

   
   
  );
}

