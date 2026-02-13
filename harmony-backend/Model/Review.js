import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: "Instructor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function(next){
  
  this.populate({
    path:'user',
    select: "fullName imageUrl",
  });
  next();
});

// reviewSchema.statics.calcAverageRatings = async function(doctorId){
//   // this points the current review
//   const stats = await this.aggregate([{
//     $match:{doctor:doctorId}
//   },{
//     $group:{
//       _id:'$doctor',
//       numOfRating:{$sum:1},
//       avgRating:{$avg:'$rating'}
//     }
//   }
// ])

//   await Doctor.findByIdAndUpdate(doctorId, {
//     totalRating: stats[0].numOfRating,
//     averageRating: stats[0].avgRating,
//   })

// }

// reviewSchema.post('save', function(){
//   this.constructor.calcAverageRatings(this.doctor);
// })


export default mongoose.model("Review", reviewSchema);