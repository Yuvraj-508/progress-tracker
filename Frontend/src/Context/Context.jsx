import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
axios.defaults.withCredentials = true; // Send cookies with requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
 const now = new Date();
  const monthYear = now.toLocaleString("default", { month: "long", year: "numeric" });

 
  const userStatus = async () => {
        setLoading(true);
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
      }finally{
         setLoading(false);
      }
     }
  
     useEffect(()=>{
     userStatus();
     },[]);

   if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        {/* Simple animated loader */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }


  const value = {
    user,
    setUser,
    navigate,
    axios,
    toast,
    monthYear,
    loading,
    setLoading // available if you want axios directly
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
