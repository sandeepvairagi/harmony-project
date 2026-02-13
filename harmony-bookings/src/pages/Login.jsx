import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../services/authAPI';
import LoginImg from '../assets/login.png';

const Login = () => {

  const [formData, setFormData] = useState({
    email:'',
    password:''
  })

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({...formData,
      [e.target.name]: e.target.value
    })
  }

  const submitHandler = async (e) =>{
    e.preventDefault();
    dispatch(login(formData.email, formData.password, navigate))

  }

  return (
    <div className='w-full h-full relative flex justify-between gap-[100px] pb-10' >
    {/* image */}
    {/* <div className='absolute w-[450px] h-[450px] top-[25%] left-[2%] rounded-full bg-[#5D59D9] ' ></div> */}
    <div className='hidden lg:flex items-center ' >
        <img src={LoginImg} width="450px" className='scale-x scale-x-[-1]' loading='lazy' alt='Side Image' />
    </div>
    {/* Content */}
    <div className='w-full lg:w-[60%] h-[100%] mt-[40px] bg-white rounded-md flex flex-col px-10 py-5 ' >
        <p className='font-medium text-[24px]' >Welcome Back🎉</p>
        <h2 className='font-bold text-3xl text-[#5D59D9] font-poppins '
        >Start your Journey !</h2>
        <div className='w-full h-[1px] bg-[#aaa9a9] mt-7 mb-10 ' ></div>
        <form className='flex flex-col gap-5 '>
                <div className='grid gap-5 grid-cols-1' >
            <div className='flex gap-8 bg-[#ECECEC] px-6 py-4 rounded-md' >
                <div className='w-[100%] flex flex-col gap-1' >
                    <label id='email' className=' font-poppins ' >Email</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='abc@gmail.com'
                        value={formData.email}
                        onChange={handleInputChange}
                        className=' w-[100%] rounded-md bg-transparent font-bold text-[16px] outline-none '
                    />
                </div>
            </div>
            <div className='flex gap-8 bg-[#ECECEC] px-6 py-4 rounded-md ' >
                <div className='w-[100%] flex flex-col gap-1' >
                    <label id='password' className=' font-poppins ' >Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter your password'
                        value={formData.password}
                        onChange={handleInputChange}
                        className=' w-[100%] rounded-md bg-transparent font-bold text-[16px] outline-none '
                    />
                </div>
            </div>
                </div>
         
            <button onClick={submitHandler}
            className='w-full mt-5 bg-[#5D59D9] font-semibold text-white px-2 py-3 rounded-md
            hover:bg-[#3e3aa3] transition-all duration-300' >Login</button>
        </form>
        <p className='mt-5 text-center text-[16px] text-black ' >Don&apos;t have an account? {" "}
            <Link to="/register">
                <span className="text-[#5D59D9]" >Register</span>
            </Link>
        </p>
    </div>
    </div>
  )
}

export default Login