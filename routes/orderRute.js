import express from "express"; 
import { creatOrder, getQuote } from "../controllers/orderController.js"; 

const orderRouter = express.Router();

orderRouter.post("/",creatOrder)

orderRouter.post("/quote",getQuote)

export default orderRouter;