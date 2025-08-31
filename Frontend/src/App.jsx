import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Form from './components/Form'
import Home from './components/Home'
import { Toaster } from 'react-hot-toast'

function App() {
  return (

    <div>
      <Navbar/>
       <div className='w-full h-screen  '>
        <button className='bg-gray-200 text-black text-2xl shadow-lg rounded- p-4 mb-7 mt-15 w-50 ml-10 '>August 2025</button>
        <div className=' flex flex-col  '>
        {Array(7).fill(null).map((_,i)=>(
             <button key={i} 
             className='bg-gray-200 text-black text-2xl shadow-lg rounded-lg p-4 w-140 m-2 ml-10 mb-7 flex justify-between items-center '  
             >Day {i+1} <div className='w-5 h-5 bg-green-600 rounded-full'></div></button>
        ))}
         </div>
        </div>

       

    <div className='min-h-screen'>
      <Navbar />
      <Toaster/>
      <div>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Form />} />
        </Routes>
      </div>

    </div>

  )
}

export default App;
