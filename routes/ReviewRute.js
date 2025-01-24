import express from "express";
import { addReview, getReview, deleteReview, approveReview } from "../controllers/reviewController.js";

const reviewRoute = express.Router();
reviewRoute.post("/",addReview);
reviewRoute.get("/",getReview);
reviewRoute.delete("/:email",deleteReview);
reviewRoute.put("/approve/:email",approveReview);

export default reviewRoute;