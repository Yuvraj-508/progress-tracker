import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { motion } from 'framer-motion'

function Home() {
  return (
    <div className="flex flex-row justify-center items-center w-full h-screen px-[6%]">
      
      {/* Left Section */}
      <div className="left w-[50%]">
        <motion.h1
          className="text-7xl text-blue-700 mb-7"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Let your dream come true!
        </motion.h1>

        <motion.h2
          className="text-3xl text-blue-600"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        >
          The key to happiness is really progress and growth and constantly working on yourself and developing something
        </motion.h2>

        <motion.button
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition mt-7"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        >
          Let's Start
        </motion.button>
      </div>

      {/* Right Section */}
      <motion.div
        className="right w-[50%]"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
      >
        <DotLottieReact
          className="w-200 h-140"
          src="https://lottie.host/3cbeff03-5104-4c3f-af84-4952256bca99/U8mhKi0J8M.lottie"
          loop
          autoplay
        />
      </motion.div>
    </div>
  )
}

export default Home
