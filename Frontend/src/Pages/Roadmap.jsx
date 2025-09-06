import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Pencil, Check } from "lucide-react";
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
  const [lockLoading, setLockLoading] = useState({});

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
const { data } = await axios.get(
  `/api/user/roadmap?roadMap=${roadmapId}&week=${week}`
);


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

  const handleEdit = (dayNumber) => {
    navigate(`/upload?mode=edit`, {
      state: {
        mode: "edit",
        category: "Roadmap",
        weekNumber: Number(selectedWeek),
        dayNumber: Number(dayNumber),
        roadmapId: selectedRoadmap._id,
        roadTitle:selectedRoadmap.title // ✅ pass correct day
      },
    });
  };

  // Lock a section (irreversible)
  const toggleLock = async (dayNumber, isLocked) => {
    if (isLocked) return; // already locked

    const confirmLock = window.confirm(
      "Are you sure you want to mark this as done? This cannot be undone."
    );
    if (!confirmLock) return;

    try {
      setLockLoading((prev) => ({ ...prev, [dayNumber]: true }));
      const { data } = await axios.put(
        `/api/user/roadmap/lock?weekNumber=${selectedWeek}&dayNumber=${dayNumber}`
      );

      if (data.success) {
          setDays(data.days);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLockLoading((prev) => ({ ...prev, [dayNumber]: false }));
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
              <p className="text-gray-500">
                No data available for this week...
              </p>
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
              {days.map((day, i) => (
                <div
                  key={day.dayNumber}
                  className={`border rounded-lg shadow-sm overflow-hidden 
                  }`}
                >
                <button
  className="flex justify-between items-center p-3 w-full text-left transition-all rounded-lg bg-white hover:bg-gray-100"
  onClick={() => toggleDay(day.dayNumber)}
>
  <span className="font-medium">
    Day {day.dayNumber}
  </span>

  {openDay === day.dayNumber ? (
    <ChevronUp className="w-5 h-5" />
  ) : (
    <ChevronDown className="w-5 h-5" />
  )}
</button>


                  {/* Description */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      openDay === day.dayNumber
                        ? "max-h-40"
                        : "max-h-0"
                    }`}
                  >
                    <p className={`p-3  whitespace-pre-line flex justify-between items-center ${day.locked ? 'line-through text-gray-400' : 'ext-gray-700'}`}>
                      {day.description || "No description"}
                      <div className="flex gap-3 ">
               <button
  onClick={() => handleEdit(day.dayNumber)} // ✅ pass actual day number
  disabled={day.locked} // ✅ prevent click if locked
  className={`w-8 h-8 flex items-center justify-center rounded-full p-1 transition-colors ${
    day.locked
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
  }`}
>
  <Pencil className="w-4 h-4" />
</button>


                        <button
                          onClick={() => toggleLock(day.dayNumber, day.locked)}
                          disabled={day.locked} // prevent click if already locked
                          className={`w-8 h-8 flex items-center justify-center  rounded-full p-1 transition-colors ${
                            day.locked
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 cursor-pointer"
                          }`}
                        >
                          {lockLoading[day.dayNumber] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Check stroke="white" className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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
