import React, { useEffect, useState } from 'react'
import Logo from "../assets/logo.png";
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import fireImg from "../assets/fire.png";
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

const Header = () => {

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState();
  
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
  
    // const presentDAY = userData?.present;
  
    let currentStreak = userData?.streak;
  
    // let lastTime = Date(userData?.lastLoggedIn)
  
    // if(presentDAY > lastTime + 24*60*60){
    //   currentStreak = 0;
    // }
  

  return (
    <div className='w-full bg-white px-8 py-3 flex justify-between items-center ' >
        <div className='flex items-center gap-5 ' >
            <img src={Logo} className='w-[60px] ' />
            <h3 className=' font-bold text-2xl uppercase font-inter ' >Harmony <span className='text-[#8582e7]' >Bookings</span></h3>
        </div>
        <div className='flex items-center gap-8 justify-between ' >
            <Link to="/" >
                <p className='hover:text-[#5D59D9]' >Home</p>
            </Link>
            <Link to="/find-a-instructor" >
            <p className='hover:text-[#5D59D9]' >Find a Instructor</p>
            </Link>
            <Link to="/asanas-library" >
            <p className='hover:text-[#5D59D9]' >Asanas Library</p>
            </Link>
            <Link to="/streak-map" >
            <p className='hover:text-[#5D59D9]' >Daily Streak</p>
            </Link>
            <Link to="/contact" >
            <p className='hover:text-[#5D59D9]' >Contact</p>
            </Link>
        </div>
        <div>
          {
            user.accountType === 'User' && (
              <div className='flex gap-1 items-center ' >
                <img src={fireImg} className='w-[50px]' />
                <p className='font-semibold text-xl ' >{!currentStreak ? 0 : currentStreak }</p>
              </div>
            )
          }
        </div>
        <div className='flex items-center gap-4 ' >
                {
                  token && user ? 
                  (
                    <div>
                        <Link to={`${user.accountType === "User" ? "/dashboard/user/my-profile" : "/dashboard/instructor/my-profile"  } `}
                        className='flex justify-center items-center gap-3 ' >
                          <figure className='w-[45px] border-2 rounded-full md:w-[45px] md:h-[45px] cursor-pointer ' >
                              <img src={user?.imageUrl} className='w-[45px] rounded-full md:w-[45px] md:h-[45px] ' alt='User Image' loading='lazy' />
                          </figure>
                          <h2 className=' text-sm md:font-bold md:text-[16px] ' >{user?.fullName.split(' ').at(0)}</h2>
                        </Link>
                  </div>
                  ) :  
                  (
                    <Link to="/login" >
                <button 
                className='bg-[#5D59D9] font-semibold text-white px-6 py-3 rounded-md
                hover:bg-[#3e3aa3] transition-all duration-300' >Login</button>
        </Link>
                  )
                }
              </div>
    </div>
  )
}

export default Header