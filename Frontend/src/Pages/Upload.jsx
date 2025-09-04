import React, { useState ,useEffect} from "react";
import axios from "axios";
import { useAppContext } from "../Context/Context";
import toast from "react-hot-toast";
import { Plus, Trash } from "lucide-react";

function Upload() {
  const { monthYear, totalWeeks, getDaysForWeek } = useAppContext();
  const [category, setCategory] = useState("TaskPlan");

  // TaskPlan state
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
    Array.from({ length: 7 }, (_, i) => ({ dayNumber: i + 1, description: "" }))
  );

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      let payload = {};
      let endpoint = "";

      if (category === "TaskPlan") {
        if (!selectedWeek || !selectedDay) {
          toast.error("Please select both week and day");
          setLoading(false);
          return;
        }

        const topicObj = topics.reduce((acc, curr) => {
          acc[curr.section] = curr.value;
          return acc;
        }, {});

        payload = {
          category,
          monthYear,
          week: Number(selectedWeek),
          day: Number(selectedDay),
          topics: topicObj,
        };
        endpoint = "/api/user/taskplan";
      } 
    else if (category === "Roadmap") {
  // Use trimmed title
  const finalTitle = title === "__new" ? newTitle.trim() : title.trim();

  if (title === "__new" && !newTitle.trim()) {
    alert("Please enter a new roadmap title");
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
    title: finalTitle, // ✅ important: use finalTitle
    days,
  };

  endpoint = "/api/user/roadmap";
}


      const { data } = await axios.post(endpoint, payload);

      if (data?.success) {
        toast.success(data?.message || "Submitted successfully!");

        setSelectedWeek("");
        setSelectedDay("");
        setTopics([
          { section: "Dsa", value: "" },
          { section: "Web", value: "" },
          { section: "Aptitude", value: "" },
          { section: "SoftSkills", value: "" },
        ]);
        setTitle("");
        setDays(
          Array.from({ length: 7 }, (_, i) => ({
            dayNumber: i + 1,
            description: "",
          }))
        );
      } else {
        toast.error(data?.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

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
            className="ml-3 p-2 border rounded bg-white shadow"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
                className="ml-3 p-2 border rounded bg-white shadow"
                value={selectedWeek}
                onChange={(e) => {
                  setSelectedWeek(e.target.value);
                  setSelectedDay("");
                }}
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
                  className="ml-3 p-2 border rounded bg-white shadow"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
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
            {topics.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <textarea
                  className="mt-1 p-2 border rounded bg-white shadow resize-none flex-1"
                  rows={2}
                  placeholder={`Enter ${topic.section} topics...`}
                  value={topic.value}
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
            ))}

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
        className="ml-3 p-2 border rounded bg-white shadow"
        value={selectedWeek}
        onChange={(e) => setSelectedWeek(e.target.value)}
      >
        <option value="">--Choose Week--</option>
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
          <option key={week} value={week}>
            Week {week}
          </option>
        ))}
      </select>
    </label>

    {/* Title selection / input */}
    <div className="mt-4 flex flex-col gap-2">
      <label className="font-medium">Roadmap Title</label>
      <select
        className="p-2 border rounded bg-white shadow"
        value={title}
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
    </div>

    {/* 7 Days inputs */}
    <div className="mt-4 flex flex-col gap-4">
      {days.map((day, index) => (
        <div key={index} className="flex flex-col gap-2">
          <label className="font-medium">Day {day.dayNumber}</label>
          <textarea
            className="p-2 border rounded bg-white shadow resize-none"
            rows={2}
            placeholder={`Enter description for Day ${day.dayNumber}`}
            value={day.description}
            onChange={(e) => handleDayChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  </>
)}


        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-400 text-white rounded-2xl p-3 cursor-pointer flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
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
