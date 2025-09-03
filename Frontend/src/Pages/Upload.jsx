import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../Context/Context";
import toast from "react-hot-toast";
import { Plus, Trash } from "lucide-react"; // optional icons

function Upload() {
  const { monthYear } = useAppContext();
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [topics, setTopics] = useState([
    { section: "Dsa", value: "" },
    { section: "Web", value: "" },
    { section: "Aptitude", value: "" },
    { section: "SoftSkills", value: "" },
  ]);
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleInputChange = (index, value) => {
    const updated = [...topics];
    updated[index].value = value;
    setTopics(updated);
  };

  // add new input
  const addInput = () => {
    setTopics([...topics, { section: `Custom-${topics.length + 1}`, value: "" }]);
  };

  // remove input
  const removeInput = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedWeek || !selectedDay) {
      alert("Please select both week and day");
      return;
    }

    // Convert topics array into object (backend expects object)
    const topicObj = topics.reduce((acc, curr) => {
      acc[curr.section] = curr.value;
      return acc;
    }, {});

    try {
      const payload = {
        monthYear,
        week: Number(selectedWeek),
        days: [{ day: Number(selectedDay), topics: topicObj }],
      };

      const { data } = await axios.post("/api/user/taskplan", payload);
      if (data?.success) {
        toast.success(data.message);
        setSelectedWeek("");
        setSelectedDay("");
        setTopics([
          { section: "Dsa", value: "" },
          { section: "Web", value: "" },
          { section: "Aptitude", value: "" },
          { section: "SoftSkills", value: "" },
        ]);
      }
    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message;
      toast.error(backendMessage || "Something went wrong, please try again");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen px-[6%]">
      <button className="bg-gray-200 text-black text-2xl shadow-lg rounded p-4 mb-7 mt-15">
        {monthYear}
      </button>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Week select */}
        <label className="text-lg font-medium">
          Select Week:
          <select
            className="ml-3 p-2 border rounded bg-white shadow"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            <option value="">--Choose Week--</option>
            {[1, 2, 3, 4, 5].map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </label>

        {/* Day select */}
        <label className="text-lg font-medium">
          Select Day:
          <select
            className="ml-3 p-2 border rounded bg-white shadow"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="">--Choose Day--</option>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <option key={day} value={day}>
                Day {day}
              </option>
            ))}
          </select>
        </label>

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
            {/* remove button */}
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

        {/* add new input */}
        <button
          type="button"
          className="bg-green-500 text-white p-2 rounded w-fit"
          onClick={addInput}
        >
          <Plus size={18} className="inline" /> Add Topic
        </button>

       <button
  type="submit"
  disabled={loading} // disable button during loading
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



