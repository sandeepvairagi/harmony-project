const Streak = require("../Model/Streak.js");

exports.createStreak = async(req,res)=>{
    try {
        let {present,streak} = req.body;

        const lastLoggedIn = Date.now();
        let value = Number(streak);
        value = value + 1;
        const streakData = await Streak.create({
            present,
            streak:value,
            lastLoggedIn,
        });

        if(!streakData){
            return res.status(403).json({
                success:false,
                message:"Can't create streak, TRG AGAIN"
            });
        }

        return res.status(200).json({
            success:true,
            message:"Streak Saved Successfully",
            data:streakData
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error while creating Streak'
        });
    }
}