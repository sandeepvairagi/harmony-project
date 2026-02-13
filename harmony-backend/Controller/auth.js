const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/User.js");
const Instructor = require("../Model/Instructor.js");
const dotenv = require("dotenv");

dotenv.config();

// Signup user
exports.register = async(req,res)=>{
    try {
        const {
            fullName,
            email,
            password,
            confirmPassword,
            phoneNumber,
            gender,
            accountType,
            imageUrl,
        } = req.body;
        // Validate fields
        if(!fullName || !email || !password || !confirmPassword || !accountType ){
            return res.status(403).json({
                success:false,
                message:'All fields are mandatory !, Please Try Again'
            });
        }
        
        // Check if both password matches or not
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:`Password doesn't match, Both password must be same`
            });
        }

        // check if user already registered with us or not
        let existingUser;
        if(accountType === 'User'){
            existingUser = await User.findOne({ email });
        }else if(accountType === 'Instructor' ) {
            existingUser = await Instructor.findOne({ email });
        }
        
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message : 'Email already exists. Please Login to continue.',
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a user
        let userData;
        if(accountType === 'User'){
            userData = await User.create({
                fullName,
                email,
                password:hashedPassword,
                phoneNumber,
                gender,
                accountType,
                imageUrl,
            });
        }else if(accountType === 'Instructor'){
            userData = await Instructor.create({
                fullName,
                email,
                password:hashedPassword,
                phoneNumber,
                gender,
                accountType,
                imageUrl,
            })
        }

        return res.status(200).json({
            success:true,
            message:'User Registered Successfully',
            data: userData,
        });

    } catch (error) {
        return res.status(500).json({
            success:true,
            message:`Cannot register user due to ${error.message}`,
        });
    }
}

//login User
exports.login = async(req,res)=>{
    try {
        // get email and pass from req
        const {email, password} = req.body;

        //validation of data
        if(!email || !password) {
            //Return 400 Bad Request status code with error message
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }
        //check user exists or not 
        let user=null;
        const   existingUser = await User.findOne({ email });
        const  existingInstructor = await Instructor.findOne({ email });

        if(existingUser){
            user = existingUser;
        }
        if(existingInstructor){
            user = existingInstructor;
        }

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'No user Found'
            })
        }

        // generate jwt 
        if(await bcrypt.compare(password, user.password)){
            const payLoad = {
                email: user.email,
                id: user._id,
            }

            const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
                expiresIn: '24h',
            });

            // save token to user document in db
            user.token = token;
            user.password = undefined;

            //create cookie and send response

            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User Login Successfully'
            });

        }else{
            return res.status(401).json({
                success: false,
                message: `Password Is Incorrect`,
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Can't login due to ${error.message}`,
        });
    }
}

// update user
exports.updateUser = async(req,res)=>{
    try{

        const {
            id,
            fullName,
            imageUrl,
            gender,
            phoneNumber,
            weight,
            height,
        } = req.body;
        //validate fields

        const userData = await User.findByIdAndUpdate({_id:id},
                {
                    fullName,
                    imageUrl,
                    gender,
                    phoneNumber,
                    weight,
                    height,
              },
            {new: true},
        );

        return res.status(200).json({
            success:true,
            message:'User Details Updated Successfully',
            data:userData,
        });


    }catch(err){
        return res.status(500).json({
            success:false,
            message:`Cannot Update User Details due to ${err.message}`,
        });
    }
}

// update Instructor 
exports.updateInstructor = async(req,res)=>{
    try{
        const {
            id,
            fullName,
            imageUrl,
            gender,
            phoneNumber,
            weight,
            height,
            specialization,
            ticketPrice,
            qualifications,
            experiences,
            timeSlots,
            about,
            bio,
        } = req.body;
        //validate fields

        const userData = await Instructor.findByIdAndUpdate({_id:id},
                {
                    fullName,
                    imageUrl,
                    gender,
                    phoneNumber,
                    weight,
                    height,
                    specialization,
                    ticketPrice,
                    qualifications,
                    experiences,
                    timeSlots,
                    about,
                    bio,
              },
            {new: true},
        );

        return res.status(200).json({
            success:true,
            message:'Instructor Details Updated Successfully',
            data:userData,
        });


    }catch(err){
        return res.status(500).json({
            success:false,
            message:`Cannot Update Instructor Details due to ${err.message}`,
        });
    }
}

exports.createStreak = async(req,res)=>{
    try {
        let {present,streak,id} = req.body;
        var currentdate = new Date();
        const lastLoggedIn = currentdate;
        let value = Number(streak);
        value = value + 1;

        const user = await User.findByIdAndUpdate({_id:id},
            {
                present:Date(present),
                streak:value,
                lastLoggedIn
          },
        {new: true},);

        if(!user){
            return res.status(403).json({
                success:false,
                message:"Can't create streak, TRG AGAIN"
            });
        }

        return res.status(200).json({
            success:true,
            message:"Streak Saved Successfully",
            data:user
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error while creating Streak'
        });
    }
}

exports.getUser = async(req,res)=>{
    try {
        const id = req.params.id;
        const user = await User.findById({_id:id});

        return res.status(200).json({
            success:true,
            message:"User fetched Successfully",
            data:user
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error while fetching user data'
        });
    }
}

exports.getInstructor = async(req,res)=>{
    try {
        const id = req.params.id;
        const user = await Instructor.findById({_id:id});

        return res.status(200).json({
            success:true,
            message:"User fetched Successfully",
            data:user
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error while fetching user data'
        });
    }
}