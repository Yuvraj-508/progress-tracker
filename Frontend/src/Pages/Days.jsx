import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../Context/Context';
import { useParams } from "react-router-dom";

const Days = () => {
  const { navigate, getDaysForWeek } = useAppContext();
  const { week } = useParams();

  const weekNum = Number(week);

  // Days (1-7) relative to week
  const daysInWeek = getDaysForWeek(weekNum);

  const today = new Date();
  const currentDay = today.getDate();

  const formatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  return (
    <div className='w-full h-screen px-[6%]'>

      <button className='bg-gray-200 text-black text-2xl shadow-lg rounded p-4 mb-7 mt-15 flex gap-5'>
        Tasks for Week {week}
        <p>{formatted}</p>
      </button>

      <div className='flex flex-wrap gap-5'>
        {daysInWeek.map((dayRel) => {

          // Convert relative day → actual day
          const actualDay = (weekNum - 1) * 7 + dayRel;

          const isToday = actualDay === currentDay;

          return (
            <div
              key={dayRel}
              className={`text-2xl shadow-lg rounded-lg p-4 w-140 m-2 flex justify-between items-center 
              ${isToday ? "bg-green-300 border-2 border-green-700" : "bg-gray-200 text-black"}`}
            >
              Day {dayRel} ({actualDay})

              <button
                onClick={() => navigate(`/task/${week}/${dayRel}`)}
                className='cursor-pointer w-10 h-10 bg-green-600 flex items-center justify-center rounded-full'
              >
                <ArrowRight stroke='white' />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Days;
