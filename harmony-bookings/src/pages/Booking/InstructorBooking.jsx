import React, { useEffect, useState } from 'react'
// import doctorImg from '../../assets/images/doctor-img02.png';
// import DoctorAbout from './DoctorAbout';
// import Feedback from './Feedback';
// import starIcon from "../../assets/star.png";
import SidePanel from './SidePanel';
import { BASE_URL } from './../../BASE_URL';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import InstructorAbout from './InstructorAbout';
import axios from 'axios';

const InstructorBooking = () => {
    const[tab, setTab] = useState('about');
  const {id} = useParams();
//   const {data:doctor, loading, error } = userfetchData(`${BASE_URL}/doctors/${id}`);

    const {user} = useSelector((state)=>state.profile);
    const {loading} = useSelector((state)=>state.auth);
    const [instructorData, setInstructorData] = useState();

    const getUserData = async() =>{
      try {
        const response = await axios.get(`${BASE_URL}/auth/get-instructor/${id}`);
        setInstructorData(response.data.data);
  
      } catch (error) {
        console.log("Error", error.message);
      }
    }
  
    useEffect(()=>{
      getUserData();
    },[])

//   const {
//     fullName,
//     bio,
//     reviews,
//     totalRating,
//     averageRating,
//     specialization,
//     ticketPrice,
//     qualifications,
//     experiences,
//     timeSlots,
//     about,
//     imageUrl,
//   } = user;

//   const rates = Math.round (averageRating * 100) / 100;
const rates = 0;
  return (
    <section className='mt-[50px]' >
    <div className='max-w-[1170px] px-5 mx-auto ' >

       { !loading  &&  
       (<div className='grid md:grid-cols-3 gap-[50px] ' >
            <div className='md:col-span-2' >
                <div className='flex items-center gap-5 ' >
                    <figure className='max-w-[200px] max-h-[200px] ' >
                      <img src={instructorData?.imageUrl} alt='Doctor Image' loading='lazy' className='w-full' />
                    </figure>

                    <div>
                      <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] 
                      lg:leading-7 font-semibold rounded '
                      >{instructorData?.specialization}</span>
                      <h3 className='text-headingColor text-[22px] leading-9 mt-3 font-bold ' >
                      {instructorData?.fullName}
                      </h3>
                      <div className='flex items-center gap-[6px] ' >
                        <span className='flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold
                        text-headingColor ' >
                          {/* <img src={starIcon} alt='Star icon' loading='lazy' /> {rates} */}
                        </span>
                        {/* <span className='text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor ' >({user?.totalRating})</span> */}
                      </div>

                      <p  className='text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px] '
                       >{instructorData?.bio}</p>

                    </div>

                </div>

                <div className='mt-[50px] borde-b border-solid border-[#0066ff34] ' >
                  <button onClick={()=> setTab('about')}
                  className={` ${tab ==='about' && 'border-b border-solid border-primaryColor ' } py-2 px-5 mr-5 text-4xl leading-7 text-headingColor font-semibold `}
                   >
                    About Instructor
                  </button>
                  {/* <button onClick={()=> setTab('feedback')}
                  className={` ${tab ==='feedback' && 'border-b border-solid border-primaryColor ' }  py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold `}
                   >
                    Feedback
                  </button> */}
                </div>

                <div className='mt-[50px]' >
                {
                  tab==='about' && (<InstructorAbout name={instructorData?.fullName} about={instructorData?.about} 
                  qualifications={instructorData?.qualifications} 
                  experiences={instructorData?.experiences} />)
                }
                {/* {
                  tab==='feedback' && (<Feedback reviews={reviews} totalRating={totalRating} />)
                } */}
                </div>
            </div>
            <div>
              <SidePanel doctorId={instructorData?._id} ticketPrice={instructorData?.ticketPrice} timeSlots={instructorData?.timeSlots} />
            </div>
        </div>)}
    </div>
</section>
  )
}

export default InstructorBooking