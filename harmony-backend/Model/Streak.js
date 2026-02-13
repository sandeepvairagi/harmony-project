const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
        present:{
            type:Date,
            required:true,
        },
        streak:{
            type:String,
        },
        lastLoggedIn:{
            type:Date
        },
});

module.exports = mongoose.model("Streak",streakSchema);