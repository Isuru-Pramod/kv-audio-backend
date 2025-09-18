import express from "express"; 
import { creatOrder } from "../controllers/orderController.js"; 

const orderRouter = express.Router();

orderRouter.post("/",creatOrder)

export default orderRouter;