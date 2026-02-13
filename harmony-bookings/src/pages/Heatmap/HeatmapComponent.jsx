// Heatmap.js
import React, { useEffect, useState } from 'react';
import fire from "./../../assets/fire.png";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../BASE_URL';
import { createStreak } from '../../services/authAPI'; 
import { useNavigate } from 'react-router-dom';
import {toast} from "react-hot-toast";

const HeatmapComponent = () => {

  const [present, setPresent] = useState('');
  const {user} = useSelector((state)=>state.profile);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState();

  const handleInputChange = (e) =>{
    setPresent({ ...present,
        [e.target.name]: e.target.value
})}

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/auth/create-streak`,{
        id:user._id,
        present,
        streak:currentStreak,
      });
      
      toast.success("Streak Updated Successfully");

    } catch (error) {
      console.log("error while creating streak",error.message);
      toast.success("Streak Cannot updated");
    }
    
  }

  const getUserData = async() =>{
    try {
      const response = await axios.get(`${BASE_URL}/auth/get-user/${user._id}`);
      setUserData(response.data.data);

    } catch (error) {
      console.log("Error", error.message);
    }
  }

  useEffect(()=>{
    getUserData();
  },[])

  const presentDAY = userData?.present;

  let currentStreak = userData?.streak;

  let lastTime = Date(userData?.lastLoggedIn)

  if(presentDAY > lastTime + 24*60*60){
    currentStreak = 0;
  }

  // if (user.lastLogin + 24 * 60 * 60 > Date.now()) {
  //   user.streak += 1;
  // } else {
  //   user.streak = 1;
  // }


  return (
     <div className='w-full h-full flex flex-col gap-5 items-center justify-center mt-5 ' >
        <div className='flex gap-2 items-center ' >
          <img src={fire} className='w-[100px]' />
          <p className='text-[80px] font-bold ' >{!currentStreak ? 0 : currentStreak }</p>
        </div>
        <div className='flex flex-col justify-center items-center  ' >
          <p className='font-semibold text-4xl ' >Congratulations! You have a {currentStreak} day streak</p>
          <p className='text-2xl' >Get Started with your daily streak</p>
        </div>
        <p className='text-lg mt-5 ' >Mark your Attendence to continue your streak</p>
        <div>
          <form className='flex flex-col gap-5 ' >
            <div className='flex gap-8 bg-white px-6 py-4 rounded-md ' >
                  <div className='w-[100%] flex flex-col gap-1 ' >
                      <label id='present' className='font-poppins font-bold ' >Mark your Attendence</label>
                      <input
                          type='date'
                          id='present'
                          name='present'
                          placeholder='Choose your present'
                          value={present}
                          onChange={handleInputChange}
                          className=' w-[100%] rounded-md bg-transparent text-[16px] outline-none '
                      />
                  </div>
              </div>
              <button onClick={handleSubmit} className='w-full bg-[#5D59D9] font-semibold text-white px-2 py-3 rounded-md
            hover:bg-[#3e3aa3] transition-all duration-300' >Present</button>
          </form>
        </div>
    </div>
  );
};

export default HeatmapComponent;
