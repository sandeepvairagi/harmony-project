import React from 'react'
import guidanceImg from "../../assets/guidance.png";
import { Link } from 'react-router-dom';

const Uniques = () => {
  return (
    <div className='w-full mx-auto mt-[100px] mb-[100px] ' >
        <div className='flex justify-between ' >
            <img src={guidanceImg} />
            <div className='flex flex-col gap-9 ' >
                <h2 className='text-3xl font-semibold ' >
                Efficient booking, <span className='text-[#5D59D9]' >tailored </span>experience, <span className='text-[#5D59D9]' >personalized</span> features – <span className='text-[#5D59D9]' >yoga perfected</span> .</h2>
                <p className=' text-lg text-slate-800 text-justify ' >Step into a realm of holistic wellness with our premier yoga appointment booking platform. Seamlessly book yoga classes, gain insights into your health with BMI tracking, and find motivation through gamification. Explore our extensive library of asanas for every level, customized yoga sessions tailored to your needs, and receive expert guidance for an enriching practice. <br/><br/> Our platform offers a harmonious blend of tradition and innovation, ensuring a transformative journey toward well-being. Join us today and experience the pinnacle of convenience, personalization, and support on your path to inner balance and vitality.</p>
                <Link to="/" >
                <button className='w-full mt-5 bg-[#5D59D9] font-semibold text-white px-2 py-3 rounded-md
                hover:bg-[#3e3aa3] transition-all duration-300'
                >Learn More !</button>
            </Link>
            </div>
        </div>
    </div>
  )
}

export default Uniques