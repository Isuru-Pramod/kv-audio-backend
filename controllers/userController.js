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

            if (user.isBlocked){
                res.status(403).json({error : "your account is blocked please contact admin"});
                return;
            }

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

export async function getAllUsers(req,res) {
    if (isItAdmin(req)){
        const users = await User.find({role : "customer"}).select("-password");
        res.json(users);
    }else{
        res.status(403).json({message : "You are not an admin"});
    }
}

export async function blockOrUnblockUser(req,res) {
    const email = req.params.email;

    if (isItAdmin(req)){
        try{
        const user = await User.findOne(
            {
                email : email
            }
        );

        if (user == null){
            res.status(404).json({error : "User not found"});
            return;
        }

        const isBlocked = !user.isBlocked;

        await User.updateOne(
            {
                email : email
            },
            {
                isBlocked : isBlocked
            }
        );

        res.json({message : "User blocked/unblocked successfully"});

        }catch{
            res.status(500).json({error : "User not found"});
        }    
        
    }else{
        res.status(403).json({message : "You are not an admin"});
    }
        
}