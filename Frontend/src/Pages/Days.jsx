import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../Context/Context';
import { useParams } from "react-router-dom";

const Days = () => {
  const { navigate, getDaysForWeek } = useAppContext();
  const { week } = useParams();

  // Convert week from URL param to number
  const weekNum = Number(week);

  // Get relative days (1-7) for selected week
  const daysInWeek = getDaysForWeek(weekNum);

  return (
    <div className='w-full h-screen px-[6%]'>
      <button className='bg-gray-200 text-black text-2xl shadow-lg rounded p-4 mb-7 mt-15'>
        Tasks for Week {week}
      </button>

      <div className='flex flex-wrap gap-5'>
        {daysInWeek.map((dayRel) => (
          <button
            key={dayRel}
            className='bg-gray-200 text-black text-2xl shadow-lg rounded-lg p-4 w-140 m-2 flex justify-between items-center'
          >
            Day {dayRel}
            <button
              onClick={() => navigate(`/task/${week}/${dayRel}`)}
              className='cursor-pointer w-10 h-10 bg-green-600 flex items-center justify-center rounded-full'
            >
              <ArrowRight stroke='white' />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Days;
