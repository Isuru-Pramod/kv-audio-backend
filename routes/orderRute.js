import express from "express"; 
import { approveOrRejectOrder, creatOrder, getOrders, getQuote } from "../controllers/orderController.js"; 

const orderRouter = express.Router();

orderRouter.post("/",creatOrder)

orderRouter.post("/quote",getQuote)

orderRouter.get("/",getOrders)

orderRouter.put("/status/:orderId",approveOrRejectOrder)

export default orderRouter;