import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent=createContext();


export const AppContextProvider=(props)=>{

            axios.defaults.withCredentials=true

const backendUrl=import.meta.env.VITE_BACKEND_URL
const [isLoggedIn, setisLoggedIn] = useState(false);
const [userData, setUserData] = useState(false);

const getAuthState=async()=>{
  try {
    const {data} = await axios.get(backendUrl+'api/auth/is-Auth')

    if(data.success) {
        setisLoggedIn(true)
        getuserdata();
    }
  } catch (error) {
          toast.error(error.message);
  }
}

const getuserdata = async () => {
  try {
    const { data } = await axios.get(backendUrl + 'api/user/data');
    
    if (data.success) {
      setUserData(data.userData);
    } else {
      toast.error(error.message);
    }
  } catch (error) {
    const errorMsg = error.response?.data?.msg || 'Failed to fetch user data';
    toast.error(errorMsg);
  }
};


useEffect(()=>  {
  getAuthState()
},[])


const value={
 backendUrl,isLoggedIn, setisLoggedIn,userData,setUserData,getuserdata
};

  return (
    <AppContent.Provider value={value}>

{props.children};

        </AppContent.Provider>
  )
}