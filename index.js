import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRute.js";
import productRouter from "./routes/productRite.js";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRoute from "./routes/ReviewRute.js";
import inquiryRouter from "./routes/Inquiryrute.js";
import cors from "cors";
import orderRouter from "./routes/orderRute.js";


dotenv.config();



const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use((req,res,next) => {
    let token = req.header("Authorization");
    if (token != null){
        token = token.replace("Bearer ","");
        jwt.verify(token, process.env.JWT_SECREE, (err, decoded)=> {
            if (!err){
                req.user = decoded;
            }
        });

    }
    next();
})

let mongoUrl = process.env.MONGU_URL;

mongoose.connect(mongoUrl);

let connection = mongoose.connection;

connection.once("open",()=>{
    console.log("conection succsesfully")
})


app.use("/api/users",userRouter);
app.use("/api/products",productRouter);
app.use("/api/reviews",reviewRoute);
app.use("/api/inquiries",inquiryRouter);
app.use("/api/orders",orderRouter);

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});

