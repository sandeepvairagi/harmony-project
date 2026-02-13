const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        fullName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        imageUrl:{
            type:String,
        },
        phoneNumber:{
            type:Number
        },
        token: {
            type : String,
        },
        height: {
            type : Number,
        },
        weight: {
            type : Number,
        },
        accountType: {
            type: String,
            enum: ['Admin', 'User'],
            required: true
        },
        gender: {
            type: String, 
            enum: ["male", "female", "other"]
        },
        present:{
            type:Date,
        },
        streak:{
            type:String,
        },
        lastLoggedIn:{
            type:Date
        },
        appointments: [
            { 
                type: mongoose.Types.ObjectId, 
                ref: "Appointment" 
            }
        ],
});

module.exports = mongoose.model("User",userSchema);