import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useAppContext } from "../Context/Context";
import toast from "react-hot-toast";
import { Plus, Trash } from "lucide-react";
import { useLocation } from "react-router";

function Upload() {
  const location = useLocation();
  const editData = location.state;
  console.log(editData);
  const { monthYear, totalWeeks, getDaysForWeek, navigate } = useAppContext();
  const [category, setCategory] = useState(editData?.category || "TaskPlan");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [topics, setTopics] = useState([
    { section: "Dsa", value: "" },
    { section: "Web", value: "" },
    { section: "Aptitude", value: "" },
    { section: "SoftSkills", value: "" },
  ]);

  // Roadmap state
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [roadmaps, setRoadmaps] = useState([]); // fetched from backend

  const [days, setDays] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      dayNumber: i + 1,
      description: "",
      locked: false,
    }))
  );

  useEffect(() => {
    if (selectedWeek) {
      const weekDays = getDaysForWeek(selectedWeek).map((day) => ({
        dayNumber: day,
        description: "",
      }));
      setDays(weekDays);
    } else {
      setDays([]); // reset if no week selected
    }
  }, [selectedWeek]);

  const [loading, setLoading] = useState(false);
  const [dayLoading, setDayLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // 🔹 Fetch roadmap/taskplan data in edit mode
  useEffect(() => {
    if (editData?.mode === "edit") {
      const fetchEditData = async () => {
        try {
          setLoading(true);

          if (editData.category === "Roadmap") {
            const { data } = await axios.get(
              `/api/user/roadmap?roadMap=${editData.roadmapId}&week=${editData.weekNumber}`
            );
            if (!data?.success) {
        toast.error(data?.message || "Failed to load roadmap week");
        return;
      }
           
            
if (data.success) {
  setDays(data.days);
  setSelectedWeek(editData.weekNumber);
  setTitle(editData.roadTitle);
}

          } else if (editData.category === "TaskPlan") {
            const { data } = await axios.get(
              `/api/user/taskplan/${editData.weekNumber}/${editData.dayNumber}`
            );
            if (data.success) {
              setTopics(
                Object.entries(data.dayData.topics).map(([section, value]) => ({
                  section,
                  value,
                }))
              );
              setSelectedDay(editData.dayNumber);
              setSelectedWeek(editData.weekNumber);
            }
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch edit data");
        } finally {
          setLoading(false);
        }
      };

      fetchEditData();
    }
  }, [editData,setDays]);
  console.log();
  //existing day check
  useEffect(() => {
    if (editData?.mode !== "edit") {
      const checkDayData = async () => {
        if (!selectedWeek || !selectedDay) return;
        setDayLoading(true);
        try {
          const { data } = await axios.get(
            `/api/user/taskplan/${selectedWeek}/${selectedDay}`
          );

          if (data.success && data.dayData) {
            // ✅ already exists → alert user
            const confirmUpdate = window.confirm(
              `Data already exists for Week ${selectedWeek}, Day ${selectedDay}. 
           Do you want to update it?`
            );

            if (!confirmUpdate) {
              // ❌ reset day selection if user cancels
              setSelectedDay("");
            }
          }
        } catch (err) {
          // ignore 404 (means no data yet), show error otherwise
          if (err.response?.status !== 404) {
            console.error(err);
            toast.error("Error checking day data");
          }
        } finally {
          setDayLoading(false);
        }
      };

      checkDayData();
      // skip check if in edit mode for TaskPlan
    }
  }, [selectedDay, selectedWeek]);

  // Fetch existing roadmaps for title dropdown
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const { data } = await axios.get("/api/user/roadmaps");
        if (data.success) {
          setRoadmaps(data.roadmaps);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch roadmaps");
      }
    };
    fetchRoadmaps();
  }, []);
  // Handle topic input (TaskPlan)
  const handleInputChange = (index, value) => {
    const updated = [...topics];
    updated[index].value = value;
    setTopics(updated);
  };

  const addInput = () => {
    setTopics([
      ...topics,
      { section: `Custom-${topics.length + 1}`, value: "" },
    ]);
  };

  const removeInput = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  // Handle roadmap input
  const handleDayChange = (index, value) => {
    const updated = [...days];
    updated[index].description = value;
    setDays(updated);
  };
  //final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      let payload = {};
      let endpoint = "";
      let method = editData?.mode === "edit" ? "put" : "post"; // ✅

      if (category === "TaskPlan") {
        payload = {
          category,
          monthYear,
          week: Number(selectedWeek),
          day: Number(selectedDay),
          topics: topics.reduce((acc, curr) => {
            acc[curr.section] = curr.value;
            return acc;
          }, {}),
          mode: "edit",
        };
        endpoint = "/api/user/taskplan";
      } else if (category === "Roadmap") {
        const finalTitle =
          title === "__new" || roadmaps.length === 0
            ? newTitle.trim()
            : title.trim();

        if (!finalTitle) {
          alert("Please enter a roadmap title");
          return;
        }

        if (!selectedWeek) {
          alert("Please select a week");
          return;
        }

        payload = {
          category,
          monthYear,
          weekNumber: Number(selectedWeek),
          title: finalTitle,
          days,
          mode: "edit",
        };
        endpoint = "/api/user/roadmap";
      }

      const { data } = await axios[method](endpoint, payload);

      if (data.success) {
        toast.success(
          data.message ||
            (editData?.mode === "edit"
              ? "Updated successfully!"
              : "Submitted successfully!")
        );
        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        {/* Simple animated loader */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="w-full h-screen px-[6%]">
      <button className="bg-gray-200 text-black text-2xl shadow-lg rounded p-4 mb-7 mt-15">
        {monthYear}
      </button>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Category select */}
        <label className="text-lg font-medium">
          Select Category:
          <select
            className="ml-3 p-2 border rounded bg-white shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={editData?.mode === "edit"}
          >
            <option value="TaskPlan">Task Plan</option>
            <option value="Roadmap">Roadmap</option>
          </select>
        </label>

        {/* TaskPlan UI */}
        {category === "TaskPlan" && (
          <>
            {/* Week select */}
            <label className="text-lg font-medium">
              Select Week:
              <select
                className="ml-3 p-2 border rounded bg-white shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedWeek}
                onChange={(e) => {
                  if (editData?.mode !== "edit") {
                    // ✅ prevent changes in edit mode
                    setSelectedWeek(e.target.value);
                    setSelectedDay("");
                  }
                }}
                disabled={editData?.mode === "edit"} // ✅ disable dropdown if edit
              >
                <option value="">--Choose Week--</option>
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(
                  (week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  )
                )}
              </select>
            </label>

            {/* Day select */}
            {selectedWeek && (
              <label className="text-lg font-medium">
                Select Day:
                <select
                  className="ml-3 p-2 border rounded bg-white shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={selectedDay}
                  onChange={(e) => {
                    if (editData?.mode !== "edit") {
                      // ✅ prevent changes in edit mode
                      setSelectedDay(e.target.value);
                    }
                  }}
                  disabled={editData?.mode === "edit"} // ✅ disable dropdown if edit
                >
                  <option value="">--Choose Day--</option>
                  {getDaysForWeek(selectedWeek).map((day) => (
                    <option key={day} value={day}>
                      Day {day}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {/* Dynamic topic inputs */}
            {/* Dynamic topic inputs */}
            {dayLoading ? (
              <p className="text-gray-500">Loading day data...</p>
            ) : (
              topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2">
                  <textarea
                    className="mt-1 p-2 border rounded bg-white shadow resize-none flex-1"
                    rows={2}
                    placeholder={`Enter ${topic.section} topics...`}
                    value={topic.value || days}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                  {topics.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-500 text-white p-2 rounded"
                      onClick={() => removeInput(index)}
                    >
                      <Trash size={18} />
                    </button>
                  )}
                </div>
              ))
            )}

            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded w-fit"
              onClick={addInput}
            >
              <Plus size={18} className="inline" /> Add Topic
            </button>
          </>
        )}

        {/* Roadmap UI */}
        {category === "Roadmap" && (
          <>
            {/* Week select */}
            <label className="text-lg font-medium">
              Select Week:
              <select
                className="ml-3 p-2 border rounded bg-white shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                disabled={editData?.mode === "edit"}
              >
                <option value="">--Choose Week--</option>
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(
                  (week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  )
                )}
              </select>
            </label>

            {/* Title selection / input */}
            <div className="mt-4 flex flex-col gap-2">
              <label className="font-medium">Roadmap Title</label>

              {roadmaps.length > 0 ? (
                <>
                  <select
                    className="p-2 border rounded bg-white shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={title}
                    disabled={editData?.mode === "edit"}
                    onChange={(e) => setTitle(e.target.value)}
                  >
                    <option value="">-- Select Existing Title --</option>
                    {roadmaps.map((r) => (
                      <option key={r._id} value={r.title}>
                        {r.title}
                      </option>
                    ))}
                    <option value="__new">➕ Create New Roadmap</option>
                  </select>

                  {/* Show input only if "Create New" is selected */}
                  {title === "__new" && (
                    <input
                      type="text"
                      placeholder="Enter new roadmap title"
                      className="p-2 border rounded bg-white shadow"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  )}
                </>
              ) : (
                // If no roadmaps → always show input
                <input
                  type="text"
                  placeholder="Enter new roadmap title"
                  className="p-2 border rounded bg-white shadow"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              )}
            </div>

            {/* 7 Days inputs */}
            <div className="mt-4 flex flex-col gap-4">
              {days.map((day, index) => (
                <div key={day.dayNumber} className="flex flex-col gap-2">
                  <label className="font-medium">Day {day.dayNumber}</label>
                  <textarea
                    className="p-2 border rounded bg-white shadow resize-none"
                    rows={2}
                    placeholder={`Enter description for Day ${day.dayNumber}`}
                    value={day.description ?? ""}
                    onChange={(e) => handleDayChange(index, e.target.value)}
                    disabled={day.locked} // optional: prevent changes if locked
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={btnLoading}
          className={`bg-blue-400 text-white rounded-2xl p-3 cursor-pointer flex items-center justify-center gap-2 ${
            btnLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {btnLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}

export default Upload;
