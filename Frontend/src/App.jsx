import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Form from './components/Form'
import Home from './components/Home'
import { Toaster } from 'react-hot-toast'
import Task from './components/Task'
import Days from './components/Days'

function App() {
  return (

  
    <div className='min-h-screen'>
      <Navbar />
      <Toaster/>
      <div>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Form />} />
           <Route path='/task' element={<Task/>} />
           <Route path='/task/:week' element={<Days/>} />
            <Route path='/task/:week/:day' element={<Days/>} />
        </Routes>
      </div>

    </div>

  )
}

export default App;
