import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {

const {backendUrl,setisLoggedIn,getuserdata}=useContext(AppContent)

const navigate=useNavigate();

    const [state,setState]=useState('Login')
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

const onSubmitHandler = async (e) => {
    e.preventDefault(); 

    try {
        axios.defaults.withCredentials = true;

        let response;

        if (state === 'Sign Up') {
            response = await axios.post(`${backendUrl}api/auth/register`, {
                name,
                email,
                password,
            });
        } else {
            response = await axios.post(`${backendUrl}api/auth/login`, {
                email,
                password,
            });
        }

        const data = response.data;

        if (data.success) {
            setisLoggedIn(true);
            getuserdata();
            navigate('/');
       toast.success(data.msg);

        } else {
            toast.error(data.msg);
        }
    } catch (error) {
        const errorMsg = error.response?.data?.msg || 'Something went wrong. Please try again.';
        toast.error(errorMsg);
    }
};


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
<img onClick={()=>navigate('/')} src={assets.logo} alt='nd ' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'></img>
 

  <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
  <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state==='Sign Up'? "Create Account" : 'Login'}</h2>

    <p className='text-center text-sm mb-6'>{state==='Sign Up'? "Create your Account" : 'Login to your account!'}</p>

   <form onSubmit={onSubmitHandler}>

    {state==='Sign Up' && (<div className='mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.person_icon}></img>
        <input onChange={e=>setName(e.target.value)} value={name} className='bg-transparent outline-none'
         type='text' placeholder='Full Name' required   />
    </div>)}
    

    <div className='mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.mail_icon}></img>
        <input onChange={e=>setEmail(e.target.value)} value={email}className='bg-transparent outline-none'
         type='email' placeholder='Email Id' required />
    </div>

    <div className='mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.lock_icon}></img>
        <input onChange={e=>setPassword(e.target.value)} value={password} className='bg-transparent outline-none'
         type='password' placeholder='Password' required />
    </div>

{state==='Login' && (  <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>)}
  <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover: cursor-pointer'>{state}</button>
   </form>

   {state==='Sign Up'?( <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
        <span onClick={()=>setState('Login')}  className='text-blue-400 underline cursor-pointer'>Login here!</span>
    </p>):( <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
        <span onClick={()=>setState('Sign Up')} className='text-blue-400 underline cursor-pointer'>Sign Up here!</span>
    </p>)}
   

  </div>
    </div>
  )
}

export default Login
