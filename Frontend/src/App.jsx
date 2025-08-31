import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Form from './components/Form'
import Home from './components/Home'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
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
