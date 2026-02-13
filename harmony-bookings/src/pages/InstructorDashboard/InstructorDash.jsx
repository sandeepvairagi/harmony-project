import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/authAPI.js';
import { useNavigate } from 'react-router-dom';
import InstructorProfile from './InstructorProfile.jsx';
import MyBookings from './MyBookings.jsx';

const InstructorDash = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tab, setTab] = useState('bookings');
    const { user } = useSelector((state) => state.profile);
    const {loading} = useSelector( (state) => state.auth );

    const [userData, setUserData] = useState();

    useEffect(()=>{
         setUserData(user);
    },[])
  return (
    <div className='max-w-[1170px] px-5 mx-auto mt-10 ' >

            {/* {
                loading && <Loading/>
            }

            {
                 && !loading && <Error errMessage={error} />
            } */}

           {
             <div className='grid md:grid-cols-3 gap-10 ' >
                <div className='pb-[50px] px-[30px] rounded-md' >
                    <div className='flex items-center justify-center ' >
                        <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-[#8582e7] ' >
                            <img src={userData?.imageUrl} alt='User-Image' className='rounded-full w-full h-full ' loading='lazy' />
                        </figure>
                    </div>

                    <div className='text-center mt-4 ' >
                        <h3 className='text-[18px] leading-[30px] text-headingColor font-bold ' >
                            {userData?.fullName}
                        </h3>
                        <p className='text-textColor text-[15px] leading-6 font-medium '
                        >{userData?.email}</p>
                        {/* <p  className='text-textColor text-[15px] leading-6 font-medium '
                        >
                            Blood Type: <span className='ml-2 text-headingColor text-[22px] leading-8 ' >
                               
                            </span>
                        </p> */}
                    </div>

                    <div className='mt-[50px] md:mt-[100px] ' >
                        <button onClick={() => {
                    dispatch(logout(navigate))
                  }}
                        className=' w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white '
                        >
                            Logout
                        </button>
                        <button className=' w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white'
                        >
                            Delete account
                        </button>
                    </div>

                </div>

                <div className='md:col-span-2 md:px-[30px] '  >
                    <div>
                        <button onClick={()=> setTab('bookings')}
                        className={` ${tab ==='bookings' && 'bg-[#8582e7] text-white font-normal' } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7
                        border border-solid border-primaryColor`}>
                            My Bookings
                        </button>
                        <button onClick={()=> setTab('settings')}
                        className={` ${tab ==='settings' && 'bg-[#8582e7] text-white font-normal' } py-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7
                        border border-solid border-primaryColor`}>
                            Instructor Profile Settings
                        </button>
                    </div>

                    {
                        tab === 'bookings' && <MyBookings />
                    }
                    {
                        tab === 'settings' && <InstructorProfile />
                    }

                </div>
            </div>
           }
        </div>
  )
}

export default InstructorDash