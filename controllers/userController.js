import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "mdipromod@gmail.com",
        pass: "uqxyszeqghdslqvd",
    },

})

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
                    phone : user.phone,
                    emailVerified : user.emailVerified
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

export function getUser(req,res){
    if (req.user != null){
        res.json(req.user);
    }else{
        res.status(401).json({message : "You are not logged in"}); 
    }

}

export async function loginWithGoogle(req,res){
    //https://www.googleapis.com/oauth2/v3/userinfo
    const accessToken = req.body.accessToken;
    console.log(accessToken);
    try{
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
        headers : {
            Authorization : `Bearer ${accessToken}`
        }
    });
    console.log(response.data);
    const user = await User.findOne({email : response.data.email,});

    if (user != null){
                    const token = jwt.sign({
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    email : user.email,
                    profilePic : user.profilePic,
                    phone : user.phone,
                    emailVerified : true
                },process.env.JWT_SECREE)

                
                res.json({message : "Login succesfull", token : token, user : user});
    }else{
        const newUser = new User({
            email : response.data.email,
            password : "123",
            firstName : response.data.given_name,
            lastName : response.data.family_name,
            profilePic : response.data.picture,
            address : "Not Given",
            phone : "Not Given",
            emailVerified : true,
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({
            firstName : savedUser.firstName,
            lastName : savedUser.lastName,
            email : savedUser.email,
            role : savedUser.role,
            profilePic : savedUser.profilePic,
            phone : savedUser.phone,
        },process.env.JWT_SECREE);

        res.json({message : "Login succesfull", token : token, user : savedUser});
    }
    }catch(e){
        console.log(e);
        res.status(500).json({message : "Failed to login with google"});
    }
}

export async function sendOTP(req,res) {
    if (req.user == null){
        res.status(403).json({message : "Unauthorized"});
        return;
    }
    const otp = Math.floor(Math.random() * 9000) + 1000;
    const newOTP = new OTP({
        email : req.user.email, 
        otp : otp
    });
    await newOTP.save();

    const message = {
        from : "mdipromod@gmail.com",
        to : req.user.email,
        subject : "Validating OTP",
        text : "Your otp code is " +otp
    }

    transport.sendMail(message,(err, info) => {
        if (err){
            console.log(err);
            res.status(500).json({message : "Failed to send OTP"});
        }else{
            console.log(info);
            res.json({message : "OTP sent successfully"});
        }
    });
}

export async function verifyOTP(req,res) {
    if (req.user == null){
        res.status(403).json({error : "Unauthorized"});
        return;
    }
    const code = req.body.code;
    const otp = await OTP.findOne({
        email : req.user.email,
        otp : code
    });

    if (otp == null){
        res.status(404).json({error : "Invalid OTP"});
        return;
    }else{
        await OTP.deleteOne({
            email : req.user.email,
            otp : code
        });

        await User.updateOne({
            email : req.user.email
        },
        {
            emailVerified : true
        });

        res.status(200).json({message : "OTP verified successfully"});

    }

}