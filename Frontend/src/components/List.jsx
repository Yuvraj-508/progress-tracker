import { ChevronDown, ChevronUp, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function List() {
  const { week, day } = useParams();
  const [openIndex, setOpenIndex] = useState(null);
  const [dayData, setDayData] = useState(null);

  // Fetch day data on load
  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    fetchData();
  }, [day, week]);

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
     const { data } = await axios.put(
  `/api/user/taskplan/${week}/${day}/lock`,
  { section: sectionTitle }
);
if (data.success) {
  setDayData(data.dayData); // now contains fresh lock state
}
    } catch (err) {
      console.error(err);
    }
  };

  if (!dayData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading or no data available...</p>
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
    <div className="w-full flex flex-col gap-5 h-screen px-[6%]">
      <button className="w-fit bg-gray-200 text-black text-sm mb-2 p-1 mt-15">
        Week {week}
      </button>
      <button className="w-fit bg-gray-200 text-black text-2xl shadow-lg rounded p-4">
        Tasks for Day {day}
      </button>

      {sections.map((section, index) => (
        <div key={index}>
          {/* Section Header */}
          <button
            className="flex justify-between text-2xl cursor-pointer items-center p-3 bg-gray-200 w-[50%] mt-8"
            onClick={() => toggleSection(index)}
          >
            {section.title}
            {openIndex === index ? <ChevronUp /> : <ChevronDown />}
          </button>

          {/* Section Content */}
          <div
            className={
              openIndex === index
                ? "flex flex-col divide-y divide-gray-300 p-3 w-[50%] bg-gray-100 rounded-md"
                : "hidden"
            }
          >
            {section.topics.map((topic, i) => (
              <p key={i} className="flex justify-between items-center py-2">
                <span
                  className={`flex items-center gap-2 ${
                    section.locked ? "line-through text-gray-500" : ""
                  }`}
                >
                  <span>{i + 1}.</span>
                  <span className="block break-all">{topic}</span>
                </span>
                <button
                  onClick={() => toggleLock(section.title, section.locked)}
                  className={`cursor-pointer w-7 h-7 ml-4 flex items-center justify-center rounded-full text-center p-1 ${
                    section.locked ? "bg-gray-400" : "bg-green-600"
                  }`}
                >
                  <Check stroke="white" />
                </button>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default List;

