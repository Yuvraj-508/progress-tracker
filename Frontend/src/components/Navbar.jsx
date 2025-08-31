import React from "react"

export default function Navbar() {
  return (
    <body>
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between ">
     
      <button className="text-xl font-bold text-blue-600 hover:text-blue-800">
        Home
      </button>

      
      <div className="hidden md:flex items-center space-x-4">
        <button className=" bg-white text-blue-600 px-4 py-2 rounded-lg">
          Task
        </button>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg ">
          Update 
        </button>

        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg  ">
         Progress
        </button>
      </div>

     
      <button className="border bg-blue-600 text-white px-4 py-2 rounded-lg ">
        Login
      </button>
    </nav>

    <p> </p>

    </body>
  );
}

