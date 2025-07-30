import React, { useContext } from 'react'
import {assets} from '../assets/assets.js'  
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
const Navbar = () => {
    const {backendUrl,isLoggedIn, setisLoggedIn,userData,setUserData}=useContext(AppContent)

  const sendVerificationOtp = async () => {
  try {
    axios.defaults.withCredentials = true;

    const { data } = await axios.post(`${backendUrl}api/auth/send-verify-otp`);

    if (data.success) {
      toast.success(data.message);
      navigate('/email-verify');
    } else {
      toast.error(data.message || 'Failed to send OTP');
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
    toast.error(errorMsg);
  }
};



const logout=async()=>{
    try {
        axios.defaults.withCredentials=true
        const {data}=await axios.post(backendUrl+'api/auth/logout')
        data.success && setisLoggedIn(false)
data.success && setUserData(false)
navigate('/')
    } catch (error) {
        toast.error(error.message);
    }
}

    const navigate = useNavigate();
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt='imgg'/>
   
       {userData? (<div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group  hover: cursor-pointer'>  {userData.name[0].toUpperCase()}
        <div className="absolute top-full right-0 z-10 hidden group-hover:block w-48 bg-white rounded-lg shadow-lg">
    <ul className="py-2 text-sm text-gray-700">

        {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"> Verify Email</li>}
      <li onClick={logout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
    </ul>
  </div>
            

         </div>) : (  <button onClick={()=>navigate('/login')} 
      className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer'>Login <img src={assets.arrow_icon} alt="arrow"/></button>)}

     
    </div>  
  )
}

export default Navbar
