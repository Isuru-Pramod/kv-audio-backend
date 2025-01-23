import express from "express";
import { addReview, getReview, deleteReview } from "../controllers/reviewController.js";

const reviewRoute = express.Router();
reviewRoute.post("/",addReview);
reviewRoute.get("/",getReview);
reviewRoute.delete("/:email",deleteReview);

export default reviewRoute;