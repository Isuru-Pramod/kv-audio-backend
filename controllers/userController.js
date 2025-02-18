import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export function registerUser(req,res){

    try{
        const data = req.body;
        let isAdmin = true;

    if ( data.role == "admin"){
        if (req.user == null || req.user.role != "admin"){
            res.status(403).json({message : "only admins can create admin accounts"})
            isAdmin = false;
        }
    }
    

    if (isAdmin){
        data.password = bcrypt.hashSync(data.password,10);

        const newUser = new User(data);
    
        newUser.save().then(()=>{
            res.json({ message : "User registered successfully"});
        }).catch((error)=>{
            res.Status(500).json({message : "User registered failed"});
        })
    }

    }catch{
        res.json({message : "error occurred. registetion failed"})
    }
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
                    email : user.email,
                    profilePic : user.profilePic,
                    phone : user.phone
                },process.env.JWT_SECREE)

                
                res.json({message : "Login succesfull", token : token, user : user});
            }else{
                res.status(401).json({message : "Login failed, Password or email is incorrect"});
            }
        }
        
    } )

}

export function isItAdmin(req){
    let isAdmin = false;

    if (req.user != null){
        if (req.user.role == "admin"){
            isAdmin = true;
        }
    }
    return isAdmin;
}

export function isItCustomer(req){
    let isCustomer = false;

    if (req.user != null){
        if (req.user.role == "customer"){
            isCustomer = true;
        }
    }
    return isCustomer;
}