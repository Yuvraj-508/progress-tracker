import React from "react"
import { NavLink } from "react-router-dom"
import { useAppContext } from "../Context/Context";
import { assets } from "../assets/assets";
export default function Navbar() {
  const {user,handleLogout} = useAppContext();

  return (
    
    <nav className="w-full bg-white shadow-md px-[6%] py-3 flex items-center justify-between ">
     
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

        <NavLink to='/weekly-report' className="bg-white text-blue-600 px-4 py-2 rounded-lg  ">

         Progress
        </NavLink>
         <NavLink to='/roadmap' className="bg-white text-blue-600 px-4 py-2 rounded-lg  ">

         Roadmap
        </NavLink>
      </div>

     {!user ? (
          <NavLink
            to='/login'
            className="cursor-pointer px-8 py-2 bg-blue-600 hover:bg-blue-400 transition text-white rounded-full"
          >
            Login
          </NavLink>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10" alt="" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
               {user.name.charAt(0).toUpperCase() + user.name.slice(1)}

              </li>
              <li
                onClick={handleLogout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
     

      
    </nav>

   
   
  );
}

