import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


function Home() {
  return (
    <div className=' flex flex-row justify-center items-center w-full h-screen px-[6%] '>
    
    <div className='left w-[50%]'>
      <h1 className='text-7xl text-blue-700 mb-7'>Let your dream come true!</h1>
      <h2 className=' text-3xl text-blue-600'>The key to happiness is really progress and growth and constantly working on yourself and developing something</h2>
     <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition mt-7">
      Let's Start
    </button>     
    </div>

     <div className='right w-[50%]  '>
    <DotLottieReact className='w-200 h-140'
      src="https://lottie.host/3cbeff03-5104-4c3f-af84-4952256bca99/U8mhKi0J8M.lottie"
      loop
      autoplay
    />
    </div>

    </div>

    

  )
}

export default Home