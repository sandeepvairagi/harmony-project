import React from 'react'
import one from "../../assets/one.png";
import two from "../../assets/two.png";
import three from "../../assets/three.png";
import four from "../../assets/four.png";
import five from "../../assets/five.png";
import six from "../../assets/six.png";

const OfferingData = [
    {
      id: "01",
      name: "7 day Yoga Health camp",
      photo: one,
      description: "Beginner yoga You will learn to control your breathing in a relaxed and controlled manner that helps provide focus in the different postures you move through.",
    },
    {
      id: "02",
      name: "Meditation",
      photo: two,
      description: "Meditation for mental balance and grounding, guided meditation. This practice invites you to observe with loving kindness and bring awareness to your internal world.",
    },
    {
      id: "03",
      name: "Empower Flow",
      photo: three,
      description: "Perfect balance of linked poses so you are challenged to explore your own personal edge. Designed to challenge, strengthen, and empower your practice as you flow breath by breath through the sequences.",
    },
    {
      id: "04",
      name: "Force",
      photo: four,
      description: "Designed to build strength, and increase heart rate. Interval training revs up your metabolism unlike anything else. When we practice yoga, the Force is within us and around us.",
    },
    ,
    {
      id: "05",
      name: "Pre-Natal Yoga",
      photo: five,
      description: "Meditation for mental balance and grounding, guided meditation. This practice invites you to observe with loving kindness and bring awareness to your internal world.",
    },
    {
      id: "06",
      name: "Advance Yoga",
      photo: six,
      description: "Perfect balance of linked poses so you are challenged to explore your own personal edge. Designed to challenge, strengthen, and empower your practice as you flow breath by breath through the sequences.",
    },
  ];

const InstructorOffering = () => {
  return (
    <div className='w-full mx-auto flex flex-col gap-10' >
        <div className='w-[40%] mx-auto flex flex-col gap-5 ' >
             <h2 className='text-center text-5xl font-semibold leading-[3.5rem] ' >Instructor <span className='text-[#5D59D9]' >Offerings</span></h2>
             <p className='text-center text-gray-700 ' >Discover your best and most powerful self with our exclusive health and wealth services.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ' >
        {
            OfferingData?.map((item)=>(
                <div className='flex flex-col gap-3 bg-slate-50 px-8 py-6 rounded-xl items-center justify-center
                hover:scale-105 transition-all duration-200 cursor-pointer ' key={item.id} >
                    <img src={item.photo} className='w-[150px]  h-[150px] ' />
                    <p className='text-2xl font-semibold ' >{item.name}</p>
                    <p className='text-justify text-md text-slate-800 ' >{item.description}</p>
                </div>
            ))
        }
        </div>
    </div>
  )
}

export default InstructorOffering