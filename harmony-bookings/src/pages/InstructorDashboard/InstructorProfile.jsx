import React, { useEffect, useState } from 'react';
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateInstructor } from '../../services/authAPI';
import Loader from "./../../components/loader/Loader.jsx";
import { AiOutlineDelete } from "react-icons/ai";

const InstructorProfile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.auth);

  console.log("data is ", user);

  useEffect(()=>{
    setFormData({
      id:user._id,
      fullName:user.fullName,
      email:user.email,
      imageUrl:user.imageUrl,
      gender:user.gender,
      weight:user.weight,
      height:user.height,
      phoneNumber:user.phoneNumber,
      specialization:user?.specialization,
      ticketPrice: user?.ticketPrice,
      qualifications: user?.qualifications,
      experiences: user?.experiences,
      timeSlots: user?.timeSlots,
      about: user?.about,
      imageUrl: user?.imageUrl,
      bio:user?.bio,
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
    specialization:"",
    ticketPrice: 0,
    qualifications:[],
    experiences:[],
    timeSlots:[],
    about:"",
    bio:'',
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

  const addItem = (key, item)=>{
    setFormData(prevFormData=> (
      {...prevFormData, 
        [key]:[...prevFormData[key],item]
      }
    ))
  }

  //reusable input change function
  const handleReusableInputChangeFunc = (key, index, event) =>{
    const {name, value} = event.target;

    setFormData(prevFormData => {
      const updateItems = [...prevFormData[key]]

      updateItems[index][name] = value;

      return {
        ...prevFormData,
        [key]: updateItems,
      }
    })
  }

  //resuable function for delete item
  const deleteItem = (key, index) =>{
    setFormData(prevFormData =>({
      ...prevFormData,
      [key]: prevFormData[key].filter((_,i) => i !== index ),
    }))
  }

  const addQualification = (e) => {
    e.preventDefault();

    addItem('qualifications', {
      startingDate:"",
      endingDate:"",
      degree:"",
      university:""
    })
  };

  const handleQualificationChange = (event,index) =>{
    handleReusableInputChangeFunc('qualifications', index, event)
  }

  const deleteQualification = (e, index) =>{
    e.preventDefault();
    deleteItem('qualifications', index);
}

const addExperience = (e) => {
  e.preventDefault();

  addItem('experiences', {
    startingDate:"",
    endingDate:"",
    position:"",
    hospital:"",
  })
};

const handleExperienceChange = (event,index) =>{
  handleReusableInputChangeFunc('experiences', index, event)
}

const deleteExperience= (e, index) =>{
  e.preventDefault();
  deleteItem('experiences', index);
}

const addTimeSlot = (e) => {
  e.preventDefault();

  addItem('timeSlots', {
    day:"",
    startingTime:"04:00",
    endingTime:"06:00",
  })
};

const handleTimeSlotChange = (event,index) =>{
  handleReusableInputChangeFunc('timeSlots', index, event)
}

const deleteTimeSlot = (e, index) =>{
  e.preventDefault();
  deleteItem('timeSlots', index);
}

  const handleSubmit = async(e) =>{
    e.preventDefault();
    
    dispatch(updateInstructor(
        formData.id,
        formData.fullName,
        formData.imageUrl,
        formData.gender,
        formData.phoneNumber,
        formData.weight,
        formData.height,
        formData.specialization,
        formData.ticketPrice,
        formData.qualifications,
        formData.experiences,
        formData.timeSlots,
        formData.about,
        formData.bio,
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
               />
           </div>
           <div className='flex flex-col gap-2 ' > 
                <label for='specialization' className='font-semibold' >Specialization</label> 
               <input type='text' placeholder='Enter your Expertise ' name='specialization' value={formData.specialization} onChange={handleInputChange}
               className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' 
               required
               />
           </div>
           <div className='flex flex-col gap-2' >
           <label for='bio' className='font-semibold' >Bio</label> 
              <input
                type='text'
                name='bio'
                value={formData.bio}
                onChange={handleInputChange}
                placeholder='Describe yourself in brief'
                className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer '
                maxLength={100}
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
           <label for='weight' className=' font-semibold' >Ticket Price</label> 
                  <input type='number' placeholder='100' name='ticketPrice' value={formData.ticketPrice}
                 className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer '  onChange={handleInputChange} />
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

         <div className='' >
                <p className=' text-xl font-semibold mb-2 ' >Qualifications*</p>
                {
                  formData.qualifications?.map((item, index)=>(
                    <div key={index} >
                        <div>
                          <div className='grid grid-cols-2 gap-5 ' >
                              <div>
                                  <p className=' font-semibold' >Starting Date*</p>
                                  <input type='date' name='startingDate' value={item.startingDate} 
                                  className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' onChange={(e)=>handleQualificationChange(e, index)} />
                              </div>
                              <div>
                                  <p className=' font-semibold' >Ending Date*</p>
                                  <input type='date' name='endingDate' value={item.endingDate} 
                                   onChange={(e)=>handleQualificationChange(e, index)}
                                   className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                          </div>
                          <div className='grid grid-cols-2 gap-5 mt-5' >
                              <div>
                                  <p className=' font-semibold' >Degree*</p>
                                  <input type='text' name='degree' value={item.degree} 
                                   onChange={(e)=>handleQualificationChange(e, index)}
                                   className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                              <div>
                                  <p className=' font-semibold' >University*</p>
                                  <input type='text' name='university' value={item.university} 
                                   onChange={(e)=>handleQualificationChange(e, index)}
                                   className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                          </div>

                          <button onClick={(e)=>deleteQualification(e,index)} className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]
                          cursor-pointer ' >
                            <AiOutlineDelete/>
                          </button>

                        </div>
                    </div>
                  ))
                }

                <button onClick={addQualification} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer ' >
                  Add Qualification
                </button>

            </div>

            <div className='' >
                <p className=' text-xl font-semibold mb-2 ' >Experiences*</p>
                {
                  formData.experiences?.map((item, index)=>(
                    <div key={index} >
                        <div>
                          <div className='grid grid-cols-2 gap-5 ' >
                              <div>
                                  <p className=' font-semibold' >Starting Date*</p>
                                  <input type='date' name='startingDate' value={item.startingDate} 
                                  onChange={(e)=>handleExperienceChange(e, index)}
                                  className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                              <div>
                                  <p className=' font-semibold' >Ending Date*</p>
                                  <input type='date' name='endingDate' value={item.endingDate} 
                                  onChange={(e)=>handleExperienceChange(e, index)}
                                  className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                          </div>
                          <div className='grid grid-cols-2 gap-5 mt-5' >
                              <div>
                                  <p className=' font-semibold' >Position*</p>
                                  <input type='text' name='position' value={item.position} 
                                  onChange={(e)=>handleExperienceChange(e, index)}
                                  className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                              <div>
                                  <p className=' font-semibold' >Hospital*</p>
                                  <input type='text' name='hospital' value={item.hospital} 
                                  onChange={(e)=>handleExperienceChange(e, index)}
                                  className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                          </div>

                          <button onClick={(e)=>deleteExperience(e,index)} className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]
                          cursor-pointer ' >
                            <AiOutlineDelete/>
                          </button>

                        </div>
                    </div>
                  ))
                }

                <button onClick={addExperience} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer ' >
                  Add Experience
                </button>

            </div>

            <div className='' >
                <p className=' text-xl font-semibold mb-2 ' >Time Slots*</p>
                {
                  formData.timeSlots?.map((item, index)=>(
                    <div key={index} >
                        <div>
                          <div className='grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5 ' >
                              <div>
                                  <p className=' font-semibold' >Day*</p>
                                  <select name='day' value={item.day} className=' text-slate-700 rounded-md font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none '
                                  onChange={(e)=>handleTimeSlotChange(e, index)} >
                                    <option value="" >Select</option>
                                    <option value="saturday" >Saturday</option>
                                    <option value="sunday" >Sunday</option>
                                    <option value="monday" >Monday</option>
                                    <option value="tuesday" >Tuesday</option>
                                    <option value="wednesday" >Wednesday</option>
                                    <option value="thursday" >Thursday</option>
                                    <option value="friday" >Friday</option>
                                  </select>
                              </div>
                              <div>
                                  <p className=' font-semibold' >Starting Time*</p>
                                  <input type='time' name='startingTime' value={item.startingTime} 
                                  onChange={(e)=>handleTimeSlotChange(e, index)}
                                  className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                              <div>
                                  <p className=' font-semibold' >Ending Time*</p>
                                  <input type='time' name='endingTime' value={item.endingTime} 
                                  onChange={(e)=>handleTimeSlotChange(e, index)}
                                  className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' />
                              </div>
                              <div className='flex items-center ' >
                                <button onClick={(e)=>deleteTimeSlot(e,index)} className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-6
                                cursor-pointer ' >
                                  <AiOutlineDelete/>
                                </button>
                              </div>
                          </div>

                        </div>
                    </div>
                  ))
                }

                <button onClick={addTimeSlot} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer ' >
                  Add TimeSlot
                </button>

            </div>

            <div className='' >
                <p className=' text-xl font-semibold mb-2 ' >About</p>
                <textarea name='about' rows={5} value={formData.about} placeholder='Write about yourself' 
                onChange={handleInputChange} className=' w-full px-4 py-3 border-b border-solid border-[#5D59D9] focus:outline-none focus:border-b-[#5D59D9]
               text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ' ></textarea>
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

export default InstructorProfile