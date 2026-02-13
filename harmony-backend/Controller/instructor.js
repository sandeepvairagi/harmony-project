const Instructor = require("../Model/Instructor.js");
const dotenv = require("dotenv");

dotenv.config();

exports.getAllInstructor = async(req,res)=>{
    try{
        const allInstructorData = await Instructor.find({}).select("-password");

        if(!allInstructorData){
            res.status(403).json({
                success:false,
                message:'Cannot fetch instructors'
            });
        }

        return res.status(200).json({
            success:true,
            message:'Instructors fetched Successfully',
            data:allInstructorData,
        });


    }catch(err){
        return res.status(500).json({
            success:false,
            message:`Cannot fetch instructor due to ${err.message}`,
        });
    }
}