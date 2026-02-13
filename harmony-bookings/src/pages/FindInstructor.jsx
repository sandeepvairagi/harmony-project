import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../BASE_URL';
import { apiConnector } from '../services/apiConnector';
import axios from 'axios';
import {toast} from "react-hot-toast";
import { Link } from 'react-router-dom';
import Loader from '../components/loader/Loader';

const FindInstructor = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState();


  const handleSearch = () =>{
    setQuery(query.trim());
  }

useEffect(()=>{
    getData();
},[])

const getData = async() =>{
    setLoading(true);
    try {
        const response = await axios.get(`${BASE_URL}/instructor/get-all`);

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        // toast.success("Instructor Data fetched Successfully");
        setInstructorData(response.data.data);
        setLoading(false);
    } catch (error) {
        console.log("error");
        // toast.error("Can't get Instructor data ")
        setLoading(false);
    }
}

  const filteredData = instructorData?.filter((item) =>
    Object.values(item)
      .join("")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  console.log("filter data is ", filteredData);



  return (
    <div>
        <section className='' >
        <div className='text-center ' >
            {/* <h2 className='heading' >Find a Instructor</h2> */}
            <div className='max-w-[80%] mt-[30px] mx-auto bg-white rounded-md flex items-center justify-between ' >
                <input 
                  type='search'
                  className='py-6 px-8 bg-transparent w-full focus:outline-none cursor-pointer '
                  placeholder='Search Instructor ' 
                  value={query}
                  onChange={(e)=> setQuery(e.target.value)}
                 />
                 <button className='bg-[#5D59D9] mr-4 font-semibold text-white px-6 py-3 rounded-md
                hover:bg-[#3e3aa3] transition-all duration-300' onClick={handleSearch} >Search</button>
            </div>
        </div>
      </section>

      <div className='w-full grid gap-[60px] grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mt-[50px]' >
        {
            loading && (<Loader className="self-center" />)
        }
        {
            !loading && (
                filteredData?.map((item)=>(
                <div key={item._id} className='rounded-lg shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]
                 flex flex-col gap-6 items-center justify-center px-12 py-8 bg-white ' >
                    {/* image */}
                    <div>
                        <img src={item.imageUrl} className='w-[70px] rounded-full ' />
                    </div>
                    <div className='flex flex-col justify-center items-center ' >
                        <p className='font-semibold text-3xl ' >{item.fullName}</p>
                        <p className='text-slate-500 ' >{item.specialization}</p>
                    </div>
                    {/* <div className='w-full h-[1px] bg-[#aaa9a9] ' ></div> */}
                    <p className='text-slate-700 text-center ' >{item.bio}</p>
                    <div className=' w-full flex justify-between items-center ' >
                    <p className=' text-white rounded-md bg-green-600 px-3 py-2  font-semibold text-2xl ' >₹{item.ticketPrice}</p>
                    <Link to={`/book-class/${item._id}`} >
                        <p  className='w-full bg-[#5D59D9] font-semibold text-white px-2 py-3 rounded-md
            hover:bg-[#3e3aa3] transition-all duration-300' >
                            Book Now
                        </p>
                    </Link>
                    </div>
                </div>
            ))
            )
        }
      </div>

      {/* <section>
        <div className='container' >

        { loading && <Loader/> }
        { error && <Error/> }

            { !loading && !error && <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ' >
              {
                  doctors.map((doctor)=>(
                      <DoctorCard key={doctor.id} doctor={doctor} />
                  ))
              }
        </div>}
        </div>
      </section> */}
    </div>
  )
}

export default FindInstructor