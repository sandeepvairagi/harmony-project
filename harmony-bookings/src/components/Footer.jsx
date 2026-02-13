import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/LogoM.png';
import {RiLinkedinFill} from 'react-icons/ri';
import { AiFillYoutube, AiFillGithub, AiOutlineInstagram } from 'react-icons/ai';

const socialLinks = [
  {
    path: "https://www.youtube.com/channel/UCkb5VkQVJ2sbMVBc171De3w",
    icon: <AiFillYoutube className='group-hover:text-white w-4 h-5 ' />
  },
  {
    path: "https://github.com/Venerablevivek",
    icon: <AiFillGithub className='group-hover:text-white w-4 h-5 ' />
  }
  ,{
    path: "https://www.instagram.com/_venerable_vivek_chaudhary_",
    icon: <AiOutlineInstagram className='group-hover:text-white w-4 h-5 ' />
  },
  {
    path: "https://www.linkedin.com/in/vivek-chaudhary-b8460321a/",
    icon: <RiLinkedinFill className='group-hover:text-white w-4 h-5 ' />
  }
];

const quickLinks01 = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/",
    display: "About us",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/",
    display: "Blog",
  }
];

const quickLinks02 = [
  {
    path: "/find-a-instructor",
    display: "Find a Instructor",
  },
  {
    path: "/asanas-library",
    display: "Asanas Library",
  },
  {
    path: "/know-your-bmi",
    display: "Check your BMI",
  },
  {
    path: "/book-yoga-class",
    display: "Book a Yoga Class",
  }
];

const quickLinks03 = [
  {
    path: "/",
    display: "Donate",
  },
  {
    path: "/contact",
    display: "Contact Us",
  }
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className=' w-full' >
      <div className='w-11/12 mx-auto h-[1px] bg-[#aaa9a9] mt-7 mb-7 ' ></div>
      <div className=' w-full px-8 py-8 mx-auto ' >
          <div className='flex justify-between flex-col md:flex-row flex-wrap gap-[30px] ' >
             <div>
                <div className='flex items-center gap-5 ' >
                <img src={logo} alt='' className='w-[80px]'  />
                <h3 className=' font-bold text-3xl uppercase font-inter ' >Harmony <span className='text-[#5D59D9]' >Bookings</span></h3>
                </div>
                {/* <p className='text-[16px] leading-7 font-[400] text-textColor mt-4' >Copyright &copy; {year} developed by Vivek Chaudhary with ❤️ </p> */}
                 
                <div className='flex items-center gap-3 mt-4' >
                  {
                    socialLinks.map( (link, index)=> (
                      <Link to={link.path} key={index} className='w-9 h-9 border border-solid border-[#181A1E] 
                      rounded-full flex items-center justify-center group hover:bg-[#5D59D9] hover:border-none ' >
                        {
                          link.icon
                        }
                      </Link>
                    ) )
                  }
                </div>
             
             </div>

             <div>
              <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor '
               >Quick Links</h2>

               <ul>
                {
                  quickLinks01.map((item, index)=> (
                    <li key={index} className='mb-4 ' >
                      <Link to={item.path} className='text-[16px] leading-7 font-[400] text-textColor '
                      >
                        {item.display}
                      </Link>
                    </li>
                  ))
                }
               </ul>

             </div>

             <div>
              <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor '
               >I want to: </h2>

               <ul>
                {
                  quickLinks02.map((item, index)=> (
                    <li key={index} className='mb-4 ' >
                      <Link to={item.path} className='text-[16px] leading-7 font-[400] text-textColor '
                      >
                        {item.display}
                      </Link>
                    </li>
                  ))
                }
               </ul>

             </div>

             <div>
              <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor '
               >Support</h2>

               <ul>
                {
                  quickLinks03.map((item, index)=> (
                    <li key={index} className='mb-4 ' >
                      <Link to={item.path} className='text-[16px] leading-7 font-[400] text-textColor '
                      >
                        {item.display}
                      </Link>
                    </li>
                  ))
                }
               </ul>

             </div>

          </div>
      </div>
    </footer>
  )
}

export default Footer