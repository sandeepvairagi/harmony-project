const User = require("../Model/User.js");
const Instructor = require("../Model/Instructor.js");
const Booking =  require('../Model/BookingSchema.js');
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();


exports.getCheckoutSession = async(req,res)=>{
    try {
        // console.log(req);
        const id = req.body.userId;
        //get currently booked instructor
        console.log("id ", id);
        
        const instructor = await Instructor.findById(req.params.instructorId);
        const user = await User.findById(id);

        console.log("user ", user);

        const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY,
                key_secret: process.env.RAZORPAY_SECRET,
        });

        const price = instructor.ticketPrice;

        // setting up options for razorpay order.
        const options = {
                amount: price*100,
                currency: 'INR',
                receipt: Math.random(Date.now()).toString(),
                payment_capture: 1
        };

        const response = await razorpay.orders.create(options);
        //create new booking
        
        const booking = new Booking({
            instructor:instructor._id,
            user:id,
            ticketPrice:instructor.ticketPrice
        });

        await booking.save();

        return res.status(200).json({
            success:true,
            message:'Successfully Paid',
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            data:response,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error while creating order'
        });
    }
}