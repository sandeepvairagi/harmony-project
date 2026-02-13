import React from 'react'
import { Link } from 'react-router-dom';
import Image from './../../assets/successful-payment.png';

const CheckoutSuccess = () => {
  return (
    <div className='bg-gray-100 h-screen '>
        <div className='bg-white flex justify-center items-center flex-col p-6 md:mx-auto ' >
            {/* SVG Image */}
            <img src={Image} alt='Thankyou Image' width='300px' style={
                {
                    alignSelf:"center",
                }} loading='lazy' />
            <div className='text-center' >
                <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center ' >
                    Payment Done!
                </h3>
                <p className='py-10 text-center ' >
                    Thank you for completing your secure online Payment.
                </p>
                <p>Have a great day! </p>
                <div className='py-10 text-center ' >
                    <Link
                        to="/home"
                        className='px-12 bg-primaryColor text-white font-semibold py-3 '
                    >
                        Go Back to Home
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CheckoutSuccess