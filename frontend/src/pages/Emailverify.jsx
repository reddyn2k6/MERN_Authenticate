import React, { useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Emailverify = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otpArray = inputRefs.current.map((el) => el.value);
      const otp = otpArray.join('');

      const { data } = await axios.post(`${backendUrl}api/auth/verify-account`, { otp });

      if (data.success) {
        toast.success(data.msg);
        getuserdata();
        navigate('/');
      } else {
        toast.error(data.msg || 'Verification failed');
      }
    } catch (err) {
      const errorMsg = data.msg || err.message || 'Something went wrong';
      toast.error(errorMsg);
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

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>Enter OTP</h2>
        <p className='text-center text-sm mb-6'>
          Enter the 6-digit OTP sent to your registered email
        </p>

        <form onSubmit={onSubmitHandler}>
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

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover: cursor-pointer'>
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default Emailverify;
