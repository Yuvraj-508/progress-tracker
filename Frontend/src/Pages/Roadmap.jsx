import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../Context/Context";

function Roadmap() {
    const { navigate } = useAppContext();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [days, setDays] = useState([]);
  const [openDay, setOpenDay] = useState(null);
const [loadingRoadmaps, setLoadingRoadmaps] = useState(false);
const [loadingDays, setLoadingDays] = useState(false);

   const toggleDay = (dayNumber) => {
    setOpenDay(openDay === dayNumber ? null : dayNumber);
  };
  // Fetch all roadmaps (only titles)
 useEffect(() => {
  const fetchRoadmaps = async () => {
    setLoadingRoadmaps(true);
    try {
      const { data } = await axios.get("/api/user/roadmaps");
      if (data.success) {
        setRoadmaps(data.roadmaps);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch roadmaps");
    } finally {
      setLoadingRoadmaps(false);
    }
  };
  fetchRoadmaps();
}, []);



  // Fetch roadmap days for selected week
const fetchWeekData = async (roadmapId, week) => {
  try {
    setLoadingDays(true);
    const { data } = await axios.get(`/api/user/roadmap/${roadmapId}?week=${week}`);

    if (data.success) {
      if (!data.days || data.days.length === 0) {
        setDays([]);
        toast.error(`No data available for Week ${week}`);
      } else {
        setDays(data.days);
      }
    } else {
      setDays([]);
      toast.error(data.message || `No data available for Week ${week}`);
    }
  } catch (err) {
    console.error(err);
    setDays([]);
    toast.error(err.response?.data?.message || "Failed to fetch week data");
  } finally {
    setLoadingDays(false);
  }
};



if (loadingRoadmaps) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-3">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500">Loading roadmaps...</p>
    </div>
  );
}



if (roadmaps.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
        <p className="text-gray-500">No data available...</p>
        <button
          className="bg-blue-600 p-2 rounded-xl text-sm text-white"
          onClick={() => navigate("/upload")}
        >
          Click Here To Upload
        </button>
      </div>
    );
  }
 
 
  return (
    <div className="w-full h-screen px-[6%] py-6 overflow-y-auto bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">📌 Roadmaps</h1>

      {/* Step 1: Select Roadmap Title */}
      <div className="mb-6">
        <label className="text-lg font-medium">
          Select Roadmap Title:
          <select
            className="ml-3 p-2 border rounded bg-white shadow"
            value={selectedRoadmap?._id || ""}
            onChange={(e) => {
              const roadmap = roadmaps.find((r) => r._id === e.target.value);
              setSelectedRoadmap(roadmap || null);
              setSelectedWeek("");
              setDays([]);
            }}
          >
            <option value="">--Choose Title--</option>
            {roadmaps.map((roadmap) => (
              <option key={roadmap._id} value={roadmap._id}>
                {roadmap.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Step 2: Show Week Selector (only if title selected) */}
      {selectedRoadmap && (
        <div className="mb-6">
          <label className="text-lg font-medium">
            Select Week:
            <select
              className="ml-3 p-2 border rounded bg-white shadow"
              value={selectedWeek}
              onChange={(e) => {
                setSelectedWeek(e.target.value);
                fetchWeekData(selectedRoadmap._id, e.target.value);
              }}
            >
              <option value="">--Choose Week--</option>
              {[1, 2, 3, 4, 5].map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Step 3: Show Days */}
     {selectedWeek && (
  <div>
    {loadingDays ? (
           <p className="text-gray-500">Loading week data...</p>
    ) : days.length === 0 ? (
      <div className="w-full h-60 flex flex-col items-center justify-center gap-2">
        <p className="text-gray-500">No data available for this week...</p>
        <button
          className="bg-blue-600 p-2 rounded-xl text-sm text-white"
          onClick={() => navigate("/upload")}
        >
          Click Here To Upload
        </button>
      </div>

    ) : (
      // ✅ Days list
      <div className="flex flex-col gap-3">
        {days.map((day) => (
          <div
            key={day.dayNumber}
            className={`border rounded-lg shadow-sm overflow-hidden ${
              day.locked ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              disabled={day.locked}
              className={`flex justify-between items-center p-3 w-full text-left transition-all 
                ${
                  day.locked
                    ? "bg-gray-200 text-gray-400"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => toggleDay(day.dayNumber)}
            >
              <span className="font-medium">
                Day {day.dayNumber} {day.locked && "🔒"}
              </span>
              {!day.locked &&
                (openDay === day.dayNumber ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                ))}
            </button>

            {/* Description */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                !day.locked && openDay === day.dayNumber
                  ? "max-h-40"
                  : "max-h-0"
              }`}
            >
              <p className="p-3 text-gray-700 whitespace-pre-line">
                {day.description || "No description"}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

    </div>
  );
}

export default Roadmap;
