import express from "express";
import { addReview,getReview } from "../controllers/reviewController.js";

const reviewRoute = express.Router();
reviewRoute.post("/",addReview);
reviewRoute.get("/",getReview);

export default reviewRoute;