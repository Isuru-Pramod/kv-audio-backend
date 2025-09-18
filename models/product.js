import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    key : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true,
        default : "uncaregorized"
    },
    dimensions : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    availability : {
        type : Boolean,
        required  : true,
        default : true
    },
    img : {
        type : [String],
        required : true,
        default : ["https://th.bing.com/th/id/OIP.qISjQuz0VsrKxe81_sA7twHaHa?rs=1&pid=ImgDetMain"]
    }
})

const Product = mongoose.model("Product",productSchema);

export default Product;