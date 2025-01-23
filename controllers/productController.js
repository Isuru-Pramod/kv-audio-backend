import product from "../models/product.js";

export function addProduct (req,res){
    console.log(req.user);

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
        res.status(500).json({error : "Product adition failed"});
    });
}