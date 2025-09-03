import React,{useEffect} from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Form from './Pages/Form'
import Home from './Pages/Home'
import { Toaster } from 'react-hot-toast'
import Task from './Pages/Task'
import Days from './Pages/Days'
import { useAppContext } from './Context/Context'
import List from './Pages/List'
import Upload from './Pages/Upload'

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
          <Route path='/login' element={user?<Home/>:<Form />} />
           <Route path='/task' element={user?<Task/>:<Form/>} />
           <Route path='/task/:week' element={<Days/>} />
            <Route path='/task/:week/:day' element={<List/>} />
            <Route path='/upload' element={ user?<Upload/>:<Form/> } />
        </Routes>
      </div>

    </div>

  )
}

export default App;
