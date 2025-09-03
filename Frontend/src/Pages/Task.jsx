import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../Context/Context';

const Task = () => {
  const { navigate, user, toast, monthYear, totalWeeks } = useAppContext();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.error("Please login to access tasks");
    }
  }, [user, navigate, toast]);

  if (!user) return null;

  return (
    <div className='w-full h-screen'>
      <button className='bg-gray-200 text-black text-2xl shadow-lg rounded p-4 mb-5 mt-15 ml-10'>
        {monthYear}
      </button>

      <div className='flex flex-col'>
        {Array.from({ length: totalWeeks }, (_, i) => (
          <button
            key={i}
            className='bg-gray-200 text-black text-2xl shadow-lg rounded-lg p-4 w-140 m-2 ml-10 flex justify-between items-center'
          >
            Week {i + 1}
            <button
              onClick={() => navigate(`/task/${i + 1}`)}
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

export default Task;
