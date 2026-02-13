import React from 'react';
import BookImg from "../../assets/register.png";
import bmiImg from "../../assets/bmiImg.png";
import gamificationImg from "../../assets/icon03.png";
import libraryImg from "../../assets/librar.png";
import needImg from "../../assets/need.png";
import guideImg from "../../assets/guide.png";

const ServicesData = [
  {
    id: "01",
    name: "Book Yoga Classes",
    photo: BookImg,
    description: "Easily reserve your spot in our rejuvenating yoga classes. Seamlessly schedule your practice for optimal wellness and balance.",
  },
  {
    id: "02",
    name: "Know your BMI",
    photo: bmiImg,
    description: "Effortlessly calculate your BMI for personalized health insights. Gain valuable data to support your wellness journey with precision.",
  },
  {
    id: "03",
    name: "Gamification",
    photo: gamificationImg,
    description: "Elevate engagement with interactive challenges and rewards. Transform tasks into fun, fostering motivation and accomplishment.",
  },
  {
    id: "04",
    name: "Asanas Library",
    photo: libraryImg,
    description: "Explore a diverse collection of yoga asanas. From beginner to advanced, find poses to enhance strength, flexibility, and relaxation.",
  },
  ,
  {
    id: "05",
    name: "Yoga as per Needs",
    photo: needImg,
    description: "Tailored yoga sessions to meet your unique needs. Whether for relaxation, strength, or flexibility, find personalized practices for you.",
  },
  {
    id: "06",
    name: "Proper Guidance",
    photo: guideImg,
    description: "Receive expert guidance to deepen your yoga practice. Learn correct alignment, breathing techniques, and mindfulness to enhance your journey.",
  },
];

const YogaServices = () => {
  return (
    <div className='w-full mx-auto flex flex-col gap-10 mt-[50px] ' >
        <div className='w-[40%] mx-auto flex flex-col gap-5 ' >
             <h2 className='text-center text-5xl font-semibold leading-[3.5rem] ' >Providing the <span className='text-[#5D59D9]' >best Yoga</span> Services</h2>
             <p className='text-center text-gray-700 ' >Transforming lives through exceptional yoga experiences. Discover your inner peace.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ' >
        {
            ServicesData?.map((item)=>(
                <div className='flex flex-col gap-3 bg-slate-50 px-8 py-6 rounded-xl items-center justify-center
                hover:scale-105 transition-all duration-200 cursor-pointer ' key={item.id} >
                    <img src={item.photo} className='w-[100px] h-[100px] ' />
                    <p className='text-2xl font-semibold ' >{item.name}</p>
                    <p className='text-justify text-md text-slate-800 ' >{item.description}</p>
                </div>
            ))
        }
        </div>
    </div>
  )
}

export default YogaServices