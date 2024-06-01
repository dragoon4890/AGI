import React from 'react'

const Navbar = () => {
  return (
    <div className=' bg-white h-14 w-screen flex flex-row items-center justify-around p-2 border-b-2 '>
        <div className='flex flex-row items-center gap-3 flex-1 ml-6'>
        <div className='rounded-[50%] bg-green-600 px-4 py-4' >
        
        </div>
        <p className=' font-semibold '>Ai Stack</p>
        </div>
        <div className='flex '>
            <div className=' relative rounded-[50%] bg-purple-500 px-4 py-4 mr-9 text-white text-'>
           <p className=' absolute bottom-1 right-3   ' >   S </p>
            </div>
        </div>
      
    </div>
  )
}

export default Navbar
