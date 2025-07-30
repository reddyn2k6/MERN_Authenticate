import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [email,setEmail]=useState('');
  const [newpassword,setNewPassword]=useState('');
  const [isEmailSent,setisEmailSent]=useState(false);
  const [otp,setOtp]=useState(0);
  const [isOtpSubmitted,setisOtpSubmitted]=useState(false);




  const { backendUrl, getuserdata } = useContext(AppContent);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (e, index) => {
    const value = e.target.value;

    // Only allow digits
    if (!/^\d?$/.test(value)) {
      e.target.value = '';
      return;
    }

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6);
    const pasteArray = paste.split('');

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index] && /^\d$/.test(char)) {
        inputRefs.current[index].value = char;
      }
    });

    // Focus next empty input
    const firstEmpty = pasteArray.findIndex((_, i) => !pasteArray[i + 1]);
    if (firstEmpty !== -1 && inputRefs.current[firstEmpty + 1]) {
      inputRefs.current[firstEmpty + 1].focus();
    }
  };


  const onSubmitEmail = async (e) => {
  e.preventDefault();  // this was breaking because 'e' was undefined

  try {
    const { data } = await axios.post(backendUrl + 'api/auth/send-reset-otp', {
      email,
    });

    if (data.success) {
      toast.success(data.msg);
      setisEmailSent(true);
    } else {
      toast.error(data.msg);
    }
  } catch (err) {
    toast.error(err.response?.data?.msg || err.message);
  }
};


const onSubmitOtp = async (e) => {
  e.preventDefault();

  const otpArray = inputRefs.current.map(input => input.value);
  const joinedOtp = otpArray.join('');

  setOtp(joinedOtp);
  setisOtpSubmitted(true);
};


const onSubmitNewPassword = async (e) => {
  e.preventDefault();

  try {
    // console.log(email,otp,newpassword);
    const { data } = await axios.post(
      backendUrl + 'api/auth/reset-password',
      {
        email,
        otp,
        newpassword,
      },
      { withCredentials: true }
    );

    if (data.success) {
      toast.success(data.msg);
      navigate('/login');
    } else {
      toast.error(data.msg);
    }
  } catch (err) {
    toast.error(err.response?.data?.msg || 'Something went wrong. Please try again.');
  }
};


  return (


<div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='logo'
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />



{/* Email form */}


{!isEmailSent && 
      <form onSubmit={onSubmitEmail} className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>Reset Password</h2>
        <p className='text-center text-sm mb-6'>
          Enter your registered email Id 
        </p>

         <div className='mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.mail_icon}></img>
                <input className='bg-transparent outline-none' onChange={(e)=>setEmail(e.target.value)}
                value={email}  type='email' placeholder='Email Id' required />
            </div>

<button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover: cursor-pointer'>Submit</button>


</form>

}


{/* Otp Form */}


{!isOtpSubmitted && isEmailSent && (
  <form onSubmit={onSubmitOtp} className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

    <h2 className='text-3xl font-semibold text-white text-center mb-3'>Enter OTP</h2>
    <p className='text-center text-sm mb-6'>
      Enter the 6-digit OTP sent to your registered email
    </p>

    <div className='flex justify-between mb-8' onPaste={handlePaste}>
      {Array(6).fill(0).map((_, index) => (
        <input
          key={index}
          type='text'
          maxLength='1'
          required
          className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md border-none focus:outline-none focus:ring-2 focus:ring-indigo-500'
          ref={(el) => (inputRefs.current[index] = el)}
          onInput={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>

    <button
      type='submit'
      className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'
    >
      Verify OTP
    </button>
  </form>
)}


{/* Password form */}


{isOtpSubmitted && isEmailSent && (
  <form
    onSubmit={onSubmitNewPassword}
    className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'
  >
    <h2 className='text-3xl font-semibold text-white text-center mb-3'>
      Enter New Password
    </h2>
    <p className='text-center text-sm mb-6'>
      Enter the new password for your account
    </p>

    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
      <img src={assets.lock_icon} alt="lock" />
      <input
        className='bg-transparent outline-none text-white w-full'
        onChange={(e) => setNewPassword(e.target.value)}
        value={newpassword}
        type='password'
        placeholder='New Password'
        required
      />
    </div>

    <button
      type='submit'
      className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'
    >
      Submit
    </button>
  </form>
)}

</div>


  );

}






  export default ResetPassword;