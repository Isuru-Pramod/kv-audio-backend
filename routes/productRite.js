import express from  "express";
import { addProduct, getProducts, updateProducts, deleteProducte } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",addProduct)
productRouter.get("/",getProducts)
productRouter.put("/:key",updateProducts)
productRouter.delete("/:key",deleteProducte)

export default productRouter;

