import React from 'react'
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../Context/Context';
import { useParams } from "react-router-dom";
const Days = () => {
     const {navigate}= useAppContext();
       const { week } = useParams();
  return (
   <div className='w-full h-screen  px-[6%]'>
        <button className='bg-gray-200 text-black text-2xl shadow-lg rounded- p-4 mb-7 mt-15  '> Tasks for Week {week} </button>
        <div className=' flex flex-wrap gap-5 '>
        {Array(7).fill(null).map((_,i)=>(
             <button key={i} 
             className='bg-gray-200 text-black text-2xl shadow-lg rounded-lg p-4 w-140 m-2  flex justify-between items-center '  
             >Day {i+1} <button onClick={()=>navigate(`/task/${week}/${i+1}`)} className=' cursor-pointer w-10 h-10 bg-green-600 flex items-center justify-center rounded-full text-center'><ArrowRight stroke='white'/></button></button>
        ))}
         </div>
        </div>
  )
}

export default Days