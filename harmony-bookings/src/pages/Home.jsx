import React from 'react'
import HomeImg from "../assets/class.png";
import { Link } from 'react-router-dom';
import YogaServices from '../components/Home/YogaServices';
import InstructorOffering from '../components/Home/InstructorOffering';
import Uniques from '../components/Home/Uniques';

const Home = () => {
  return (
    <div className='w-full h-full flex flex-col font-poppins gap-10 ' >
      <div className='w-full h-full flex gap-10 font-poppins mt-10 mb-5' >
      <div className=' w-[50%] flex flex-col gap-5 ' >
          <div className='flex flex-col gap-2 ' >
            <p className='text-6xl font-bold ' >Stretch,</p>
            <p className='text-6xl font-bold text-[#5D59D9] ' >Breathe,</p>
            <p className='text-6xl font-bold ' >Book</p>
          </div>
          <p className='text-4xl font-semibold ' >Your <span className='text-[#5D59D9]' >Yoga Journey</span> Starts Here</p>
          <p className=' text-justify ' ><span className='font-bold text-2xl ' >"</span>Welcome to our online yoga booking platform! Discover peace and balance with ease as you explore our 
          extensive class schedule and reserve your spot effortlessly. With seamless booking, personalized profiles, and convenient reminders, 
          embark on a journey of wellness tailored to your needs.<span className='font-bold text-2xl ' >"</span></p>
          {/* <p className='' >From Asana to Om:</p> */}
          <Link>
            <button className='w-full mt-5 bg-[#5D59D9] font-semibold text-white px-2 py-3 rounded-md
            hover:bg-[#3e3aa3] transition-all duration-300'
            >Book Your Flow Today !</button>
          </Link>
      </div>

      {/* image */}
      <div className=' flex items-center justify-center ' >
        <img src={HomeImg} />
      </div>
      </div>
      <YogaServices/>
      <Uniques/>
      <InstructorOffering/>
    </div>
  )
}

export default Home