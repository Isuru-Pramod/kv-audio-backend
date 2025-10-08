import express from "express";
import { getAllUsers, loginUser, registerUser } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/",registerUser)

userRouter.post("/login",loginUser)

userRouter.post("/all",getAllUsers)



export default userRouter;
