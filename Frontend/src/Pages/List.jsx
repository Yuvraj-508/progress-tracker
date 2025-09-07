import { ChevronDown, ChevronUp, Check,Edit,Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../Context/Context";
import ProgressBar from "../components/ProgressBar";

function List() {
const { navigate } = useAppContext();
  const { week, day } = useParams();
  const [openIndex, setOpenIndex] = useState(null);
  const [dayData, setDayData] = useState(null);
    const [loading, setLoading] = useState(false); 
  const [lockLoading, setLockLoading] = useState({}); 
  const [editing, setEditing] = useState(null); // {sectionTitle, topicIndex}
  const [editValue, setEditValue] = useState("");
// { Dsa: false, Web: false, ... }

  console.log(openIndex);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/user/taskplan/${week}/${day}`);
        if (data?.success) {
          setDayData(data.dayData);
        } else {
          setDayData(null);
        }
      } catch (err) {
        console.error(err);
        setDayData(null);
      }finally {
        setLoading(false); // hide loader
      }
    };
    fetchData();
  }, [day, week]);
  
console.log(dayData);
  // Toggle expand/collapse
  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Lock a section (irreversible)
const toggleLock = async (sectionTitle, isLocked) => {
  if (isLocked) return; // already locked

  const confirmLock = window.confirm(
    "Are you sure you want to mark this as done? This cannot be undone."
  );
  if (!confirmLock) return;

  try {
    // set loader for this section
    setLockLoading(prev => ({ ...prev, [sectionTitle]: true }));

    const { data } = await axios.put(
      `/api/user/taskplan/${week}/${day}/lock`,
      { section: sectionTitle }
    );

    if (data.success) {
      setDayData(data.dayData); // update fresh lock state
    }
  } catch (err) {
    console.error(err);
  } finally {
    // hide loader for this section
    setLockLoading(prev => ({ ...prev, [sectionTitle]: false }));
  }
};

const handleEdit = (sectionId) => {
  navigate(`/upload?mode=edit`, {
  state: {
    mode: "edit",
    category: "TaskPlan",
    roadmapId: sectionId,
    weekNumber: Number(week), // ✅ ensure number
    dayNumber: Number(day),   // ✅ ensure number
  },
  });

};



   if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        {/* Simple animated loader */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!dayData) {
    return (
      <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
        <p className="text-gray-500">No data available...</p>
        <button className="bg-blue-600 p-2 rounded-xl text-sm text-white" 
        onClick={()=>{
          navigate('/upload')
        }}>Click Here To Upload</button>
      </div>
    );
  }
  // Build sections from backend data
  // Convert Map objects into plain JS objects
// Ensure fallback to empty object
const topics = dayData?.topics ? { ...dayData.topics } : {};
const locked = dayData?.locked ? { ...dayData.locked } : {};

// Now dynamically build sections
const sections = Object.keys(topics).map((key) => ({
  title: key,
  topics: [topics[key]],
  locked: locked[key] ?? false, // fallback to false if undefined
}));

console.log(sections);



  return (
   <div className="w-full flex flex-col items-center gap-5 h-full px-6 py-8 bg-gray-50">
  {/* Week and Day */}
  <ProgressBar sections={sections} />
  
  <div className="flex mb-5 flex-col gap-5 items-center ">
    <button className="bg-gray-200 text-black text-sm px-4 py-1 rounded-full shadow">
      Week {week}
    </button>
    <button className="bg-gray-200 text-black text-2xl shadow-md rounded-xl px-6 py-3">
      Tasks for Day {day}
    </button>
  </div>

  {/* Sections */}


{sections.map((section, index) => (
  <div
    key={index}
    className="w-[45%] bg-white rounded-2xl shadow-md overflow-hidden"
  >
    {/* Section Header */}
    <button
      className="flex justify-between items-center p-4 bg-gray-200 hover:bg-gray-300 transition-all font-semibold cursor-pointer text-lg w-full"
      onClick={() => toggleSection(index)}
    >
      <span>{section.title}</span>
      <span>
        {openIndex === index ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </span>
    </button>

    {/* Section Content */}
    <div
      className={`overflow-hidden transition-all duration-300 ${
        openIndex === index ? "max-h-[1000px]" : "max-h-0"
      }`}
    >
      <div className="p-3 flex flex-col gap-2">
        {section.topics.map((topic, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b last:border-b-0"
          >
            <span
              className={`flex items-center gap-2 ${
                section.locked ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              <span className="font-semibold">{i + 1}.</span>
              <span className="break-words">{topic}</span>
            </span>

            <div className="flex items-center gap-2">
              {/* Edit Button */}
         <button
  onClick={() => handleEdit(i)} 
  disabled={section.locked}
  className={`w-8 h-8 flex items-center justify-center rounded-full p-1 transition-colors ${
    section.locked
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  <Pencil className="w-4 h-4" />
</button>



              {/* Lock Button */}
              <button
                onClick={() => toggleLock(section.title, section.locked)}
                className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full p-1 transition-colors ${
                  section.locked
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {lockLoading[section.title] ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check stroke="white" className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
))}

  </div>


  );
}

export default List;

