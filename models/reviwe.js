import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    rating :{
        type : Number,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true,
        default : Date.now()
    },
    isApproved : {
        type : Boolean,
        required : true,
        default : false
    },
    profilePic : {
    type : String,
    required : true,
    default : "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg"
    }
})

const Review = mongoose.model("Review",reviewSchema);

export default Review;