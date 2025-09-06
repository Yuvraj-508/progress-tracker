import axios from "axios";
import { createContext, useContext, useState, useEffect,useMemo } from "react";
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
   const { totalDays, totalWeeks } = useMemo(() => {
    if (!monthYear) return { totalDays: 0, totalWeeks: 0 };

    const [monthName, year] = monthYear.split(" ");
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const weeks = Math.ceil(daysInMonth / 7);

    return { totalDays: daysInMonth, totalWeeks: weeks };
  }, [monthYear]);

    // 🔹 Function: get relative days for week
  const getDaysForWeek = (weekNum) => {
    if (!weekNum) return [];

    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = Math.min(startDay + 6, totalDays);

    // relative days (1–7 inside week)
    return Array.from({ length: endDay - startDay + 1 }, (_, i) => i + 1);
  };

  const getAbsoluteDaysForWeek = (weekNum) => {
    if (!weekNum) return [];

    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = Math.min(startDay + 6, totalDays);

    return Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
  };
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
      const { data } = await axios.post("/user/logout", {
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
    handleLogout,
    totalDays,
    totalWeeks,
    getDaysForWeek,        // relative 1–7 inside week
    getAbsoluteDaysForWeek // ✅ export logout so you can use it anywhere
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
