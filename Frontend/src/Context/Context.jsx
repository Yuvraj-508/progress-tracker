import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true; // Always send cookies
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const monthYear = now.toLocaleString("default", { month: "long", year: "numeric" });

  // ✅ Check login status
  const userStatus = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/user/is-auth");
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Call userStatus once when app loads
  useEffect(() => {
    userStatus();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/user/logout", {
        withCredentials: true,
      });
      if (data?.success) {
        setUser(null); // clear user state
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || "Try again later");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        {/* Loader */}
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
    setLoading,
    userStatus,
    handleLogout, // ✅ export logout so you can use it anywhere
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
