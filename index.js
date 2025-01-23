import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRute.js";
import productRouter from "./routes/productRite.js";
import jwt, { decode } from "jsonwebtoken";





let app = express();
app.use(bodyParser.json());


app.use((req,res,next) => {
    let token = req.header("Authorization");
    if (token != null){
        token = token.replace("Bearer ","");
        jwt.verify(token, "Isuru_2005", (err, decoded)=> {
            if (!err){
                req.user = decoded;
            }
        });

    }
    next();
})

let mongoUrl = "mongodb+srv://admin:123@cluster0.f54dx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl);

let connection = mongoose.connection;

connection.once("open",()=>{
    console.log("conection succsesfully")
})


app.use("/api/users",userRouter);
app.use("/api/products",productRouter);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

