import React from 'react'

const Task = () => {
  return (
    <div className='w-full h-screen  '>
        <button className='bg-gray-200 text-black text-2xl shadow-lg rounded- p-4 mb-5 mt-15 w-50 ml-10'>August 2025</button>
        <div className=' flex flex-col  '>
        {Array(4).fill(null).map((_,i)=>(
             <button key={i} 
             className='bg-gray-200 text-black text-2xl shadow-lg rounded-lg p-4 w-140 m-2 ml-10 flex justify-between items-center '  
             >Week {i+1} <div className='w-5 h-5 bg-green-600 rounded-full'></div></button>
        ))}
         </div>
        </div>
  )
}

export default Task