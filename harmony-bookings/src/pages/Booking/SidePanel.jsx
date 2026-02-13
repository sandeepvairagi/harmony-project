import React from 'react'
import convertTime from '../../utils/convertTime'
import { BASE_URL } from './../../BASE_URL';
import {toast} from "react-hot-toast";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { apiConnector } from '../../services/apiConnector';

// Function to load script and append in DOM tree.
const loadScript = src => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log('razorpay loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.log('error in loading razorpay');
      resolve(false);
    };
    document.body.appendChild(script);
  });

const SidePanel = ({instructorId, ticketPrice, timeSlots}) => {

    const {user} = useSelector((state)=>state.profile);
    const InstuctId = useParams();
    const id = InstuctId.id;

    const navigate = useNavigate();

    const bookingHandler = async()=>{
        try {

            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

            console.log("isme aaya 1");

            if (!res) {
            toast.error(
                "Razorpay SDK failed to load. Check your Internet Connection.")
            return
            }

            // Initiating the Order in Backend
            //   const orderResponse = await fetch(`${BASE_URL}/bookings/checkout-session/${id}`,{
            //     method:'post',
            //     headers:{
            //         Authorization:`Bearer ${user?.token}`
            //     },
            //     body:{
            //         userId:user._id
            //     },
            // });
            const userId = user._id;

            //   const orderResponse = await fetch(`${BASE_URL}/bookings/checkout-session/${id}`,{
            // const orderResponse = await axios.post(`${BASE_URL}/bookings/checkout-session/${id}`, {
            //     userId
            // });
            const orderResponse = await apiConnector("POST",`${BASE_URL}/bookings/checkout-session/${id}`,{
                userId
            });

            console.log("isme aaya 2");
            console.log("order",orderResponse);
            if (orderResponse.status!==200) {
                throw new Error(orderResponse.message)
            }

            console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.message);

            // Opening the Razorpay SDK
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                currency: orderResponse.currency,
                amount: ticketPrice*100,
                order_id: orderResponse.id,
                name: "Harmony Bookings",
                description: "Thank you for Purchasing the Course.",
                prefill: {
                name: `${"Harmony"} ${"Bookings"}`,
                email: "vchcoolboy@gmail.com",
                },
                handler: function (response) {
                    navigate("/checkout-success");
                },
            }

            const paymentObject = new window.Razorpay(options)
        
            paymentObject.open()
            paymentObject.on("payment.failed", function (response) {
                toast.error("Oops! Payment Failed.")
                console.log(response.error)
            })

        } catch (error) {
            console.log("PAYMENT API ERROR............", error.message)
            toast.error("Could Not make Payment.")
        }
    }

  return (
    <div className=' bg-white p-3 lg:p-5 rounded-md  ' >
        <div className='flex items-center justify-between ' >
            <p className='text-2xl mt-0 font-semibold ' >Ticket Price</p>
            <span className='text-[40px] leading-7 lg:text-[22px] lg:leading-8 text-green-500 font-bold ' >
            {ticketPrice} INR</span>
        </div>

        <div className='mt-[25px]' >
            <p className='text-2xl mt-0 font-semibold text-headingColor '
            >Available Time Slots:</p>

            <ul className='mt-3' >
            {
                timeSlots?.map((item, index)=>(
                    <li key={index} className='flex items-center justify-between mb-2' >
                    <p className='text-[15px] leading-6 text-textColor font-semibold ' >
                    {item.day.charAt(0).toUpperCase() + item.day.slice(1)}</p>
                    <p className='text-[15px] leading-6 text-textColor font-semibold ' >
                    {convertTime(item.startingTime)} - {convertTime(item.endingTime)}</p>
                </li>
                ))
            }
                
            </ul>
        </div>
        <button 
         onClick={bookingHandler} className='w-full bg-[#5D59D9] font-semibold text-white px-2 py-3 rounded-md
            hover:bg-[#3e3aa3] transition-all duration-300 mt-8' >Book Class</button>
    </div>
  )
}

export default SidePanel