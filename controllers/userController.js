import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export function registerUser(req,res){


    const data = req.body;

    data.password = bcrypt.hashSync(data.password,10);

    const newUser = new User(data);

    newUser.save().then(()=>{
        res.json({ message : "User registered successfully"});
    }).catch((error)=>{
        res.Status(500).json({message : "User registered failed"});
    })

}

export function loginUser(req,res){
    const data = req.body;

    User.findOne({
        email : data.email
    }).then((user)=>{
        if (user == null){
            res.status(404).json({message : "User not found"})
        }else{

            const isPasswordCorrect = bcrypt.compareSync(data.password,user.password);
            if (isPasswordCorrect){
                const token = jwt.sign({
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    email : user.email
                },process.env.JWT_SECREE)
                res.json({message : "Login succesfull", token : token});
            }else{
                res.status(401).json({error : "Login failed, Password or email is incorrect"});
            }
        }
        
    } )

}