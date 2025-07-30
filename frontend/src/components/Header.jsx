import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import {Typewriter} from 'react-simple-typewriter'
import { AppContent } from '../context/AppContext'

const Header = () => {
const {userData,getuserdata}=useContext(AppContent);
const navigate=useNavigate();
const firstword = `Hello ${userData?.name || 'Developer'} 😊`;
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center'> 
      <img src={assets.header_img} alt='helo' className='w-36 h-36 rounded-full mb-6' />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
<Typewriter 
words={[firstword,"Let have some fun"]}
loop={true}
cursor
cursorStyle='|'
typeSpeed={70}
deleteSpeed={50}
delaySpeed={1000}
/>
      </h1>
      <img className='w-8 aspect-square' src={assets.hand_wave} alt='helo'></img>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our <span className='text-purple-600'>MERN Authentication App</span></h2>

      <p className='mb-8 max-w-md'>Let's start</p>

<button
  onClick={() => navigate('/login')}
  className="bg-purple-600 text-white rounded-full px-8 py-2.5 hover:bg-purple-700 transition duration-300 cursor-pointer"
>
  Get Started
</button>
    </div>
  )
}

export default Header
