import express from "express"; 
import { creatOrder, getOrders, getQuote } from "../controllers/orderController.js"; 

const orderRouter = express.Router();

orderRouter.post("/",creatOrder)

orderRouter.post("/quote",getQuote)

orderRouter.get("/",getOrders)

export default orderRouter;