import product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export function addProduct (req,res){
    console.log(req.user);
    console.log(req.body);

    if (req.user == null){
        res.status(401).json({
            message : "Please loging and try again"
        });
        return
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message : "you not an admin. you don't have permission for that"
        })
        return;
    }


    const data = req.body;
    const newProduct = new product(data);

    newProduct.save().then(()=>{
        res.json({message : "Product added succesfully"});
    }).catch((error)=>{
        res.status(500).json({message : "Product adition failed"});
    });
}

export async function  getProducts(req,res){

    
    try{
        if (isItAdmin(req)){
            const products = await product.find();
            res.json(products);
            return;
        }else{
            const products = await product.find({"availability": true,});
            res.json(products);
            return;
        }
    }catch{
        res.status(500).json({
            message : "Failed to get products"
        })
    }
}

export async function updateProducts(req,res){
    try{
        if(isItAdmin(req)){
            const key = req.params.key;
            const data = req.body;

            await product.updateOne({key:key},data);
            res.json({
                message : "Product updated successfully "
            })
            return;
        }else{
            res.status(403).json({message : "you are not authorized to perform this action"})
            return;
        }
    }catch(err){
        res.status(500).json({message : "Failed to update product"})
    }

}

export async function deleteProducte (req,res){
    try{
        if (isItAdmin(req)){
            const key = req.params.key;
            const data = req.body;

            await product.deleteOne({key:key})
            res.json({
                message : "Product deleted successfully "
            }) 
        }else{
            res.status(403).json({message : "you are not authorized to perform this action"})
            return; 
        }
    }catch(e){
        res.status(500).json({message : "Failed to delete product"})
    }
}
