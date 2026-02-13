import React, { useEffect, useState } from 'react';
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../services/authAPI';
import Loader from "./../../components/loader/Loader.jsx";

const Userpxofile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.auth);

  useEffect(()=>{
    setFormData({
      id:user._id,
      fullName:user.fullName,
      email:user.email,
      imageUrl:user.imageUrl,
      gender:user.gender,
      weight:user.weight,
      height:user.height,
      phoneNumber:user.phoneNumber
    });
  },[])

  const [formData, setFormData] = useState({
    id:'',
    fullName:'',
    email:'',
    imageUrl:null,
    gender:'',
    phoneNumber:'',
    weight:'',
    height:'',
  })

  const handleInputChange = (e) => {
    setFormData({...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileInputChange = async (e)=>{
    const file = e.target.files[0];
    
    const data = await uploadImageToCloudinary(file);

    setSelectedFile(data.secure_url);
    setFormData({...formData, imageUrl:data.secure_url});

  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    
    dispatch(updateUser(
        formData.id,
        formData.fullName,
        formData.phoneNumber,
        formData.gender,
        formData.imageUrl,
        formData.height,
        formData.weight,
        navigate,
    ));

  }

  return (
    <div className='mt-10' >
    <form className='flex flex-col gap-10 ' onSubmit={handleSubmit} >
         <div className='grid grid-cols-1 md:grid-cols-2 gap-5 ' >
         <div className=' flex flex-col gap-2  ' >
                <label for='fullName' className=' font-semibold' >Full Name</label>
               <input type='text' placeholder='Full Name' name='name' value={formData.fullName} onChange={handleInputChange}
               className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' 
               required
               />
           </div>
           <div className='flex flex-col gap-2 ' >
           <label for='email' className=' font-semibold' >Email</label>
           <input type='email' placeholder='Enter your Email' name='email' value={formData.email} onChange={handleInputChange}
            className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer '  
           aria-readOnly
           readOnly
           />
          </div>
          <div className=' flex flex-col gap-2 ' >  
                <label for='phoneNumber' className=' font-semibold' >Phone Number</label>
               <input type='text' placeholder='Phone Number' name='phoneNumber' value={formData.phoneNumber} onChange={handleInputChange}
               className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' 
               required
               />
           </div>
           <div className='flex flex-col gap-2 ' > 
                <label for='height' className='font-semibold' >Height</label> 
               <input type='number' placeholder='Height (in cm) ' name='height' value={formData.height} onChange={handleInputChange}
               className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' 
               required
               />
           </div>
           <div className='flex flex-col gap-2 ' > 
               <label for='weight' className=' font-semibold' >Weight</label> 
               <input type='number' placeholder='Weight (in lbs) ' name='weight' value={formData.weight} onChange={handleInputChange}
               className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' 
               required
               />
           </div>
       <div className='flex flex-col gap-2 ' >
            <label for='gender' className=' font-semibold' >Gender</label>
             <select
               name='gender'
               value={formData.gender} onChange={handleInputChange}
               className=' text-slate-700 rounded-md font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none '
             >
               <option value='' >Select</option>
               <option value='male' >Male</option>
               <option value='female' >Female</option>
               <option value='other' >Other</option>
             </select>
       </div>

       <div className=' flex items-center gap-3 ' >
         {
           formData.imageUrl && <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-[#5D59D9] flex items-center justify-center ' >
           <img src={formData.imageUrl} alt='User image' loading='lazy' className='w-full h-full rounded-full ' />
         </figure>
         }

         <div className='relative w-[130px] h-[50px] ' >
           <input 
             type='file'
             name='imageUrl'
             id='imageUrl'
             onChange={handleFileInputChange}
             accept='.jpg, .png'
             className=' absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer '
            />
            <label htmlFor='imageUrl' className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] 
            text-[15px] leading-6 overflow-hidden bg-[#7b77e9] text-white font-semibold rounded-lg truncate cursor-pointer '
             >
               {
                 selectedFile ? selectedFile.name : "Upload Photo"
               }
             </label>
         </div>
       </div>
         </div>

       <div>
         <button disabled={loading && true }
          className='w-full bg-[#5D59D9] font-semibold text-white px-6 py-3 rounded-md
                hover:bg-[#3e3aa3] transition-all duration-300' type='submit' >
          {
           loading ? <Loader/> : 'Update Details '
          }</button>
       </div>

     </form>
</div>
  )
}

export default Userpxofile