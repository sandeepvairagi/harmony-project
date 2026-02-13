import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AsanasLibrary = () => {

    const [posesData, setPosesData] = useState([]);
    

    const url = 'https://yoga-api-nzy4.onrender.com/v1/categories';

    const getData = async()=>{
        try {
            const response = await axios.get(url);
            // console.log(response.data);
            const categories = response.data;
        
        // Extracting poses data from categories and flattening it into an array
        const allPoses = categories.reduce((acc, curr) => {
          acc.push(...curr.poses);
          return acc;
        }, []);

            setPosesData(allPoses);
        } catch (error) {
            console.log("error occures", error.message);
        }
    }

    useEffect(()=>{
        getData();
    },[])

    console.log("posedata ", posesData);

  return (
    <div className='w-full grid grid-cols-3 gap-10 mt-10 ' >
        {
            posesData?.map((pose)=>(
                <div key={pose.id} className='bg-white shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] flex flex-col items-center px-8 py-10 rounded-lg '  >
                    <div className='mb-2' >
                        <img src={pose.url_png} width="150px" />
                    </div>
                    <p className='text-2xl font-bold text-[#5D59D9] text-center ' >{pose.sanskrit_name_adapted}</p>
                    <p className='text-lg text-slate-900 mb-5' >{pose.category_name}</p>
                    <p className='text-justify text-sm text-slate-600 ' >{pose.pose_description.split(' ').slice(0, 40).join(' ')}</p>
                </div>
            ))
        }
    </div>
  )
}

export default AsanasLibrary