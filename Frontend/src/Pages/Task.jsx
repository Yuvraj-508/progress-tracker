import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../Context/Context';

const Task = () => {
  const { navigate, user, toast, monthYear } = useAppContext();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.error("Please login to access tasks");
    }
  }, [user, navigate, toast]);

  if (!user) return null;

  // Current date
  const today = new Date();
  const currentDay = today.getDate();

  // Total days in current month
  const totalDays = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // Days left
  const daysLeft = totalDays - currentDay;

  // Total weeks in month
  const totalWeeks = Math.ceil(totalDays / 7);

  return (
    <div className='w-full h-screen'>

      {/* Month */}
      <button className='bg-gray-200 text-black text-2xl shadow-lg rounded p-4 mb-5 mt-15 ml-10'>
        {monthYear}
      </button>

      {/* Current Day Info */}
      <p className='ml-10 text-lg mb-6'>
        Today is Day {currentDay} • {daysLeft} days left in this month
      </p>

      {/* Weeks */}
      <div className='flex flex-col'>
        {Array.from({ length: totalWeeks }, (_, i) => {

          const startDay = i * 7 + 1;
          const endDay = Math.min((i + 1) * 7, totalDays);

          return (
            <div
              key={i}
              className='bg-gray-200 text-black text-2xl shadow-lg rounded-lg p-4 w-140 m-2 ml-10 flex justify-between items-center'
            >
              <span>
                Week {i + 1} ({startDay}-{endDay} days)
              </span>

              <button
                onClick={() => navigate(`/task/${i + 1}`)}
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

export default Task;