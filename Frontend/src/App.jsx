import React,{useEffect} from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Form from './components/Form'
import Home from './components/Home'
import { Toaster } from 'react-hot-toast'
import Task from './components/Task'
import Days from './components/Days'
import { useAppContext } from './Context/Context'
import List from './components/List'
import Upload from './components/Upload'

function App() {
  const {user,axios,setUser}=useAppContext();
    const userStatus = async () => {
      try {
        const { data } = await axios.get('/user/is-auth');
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
        setUser(null); 
      }
     }
  
     useEffect(()=>{
     userStatus();
     },[])
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
            <Route path='/task/:week/:day' element={<List/>} />
            <Route path='/upload' element={ <Upload/> } />
        </Routes>
      </div>

    </div>

  )
}

export default App;
