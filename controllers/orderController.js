import e from "express";
import Product from "../models/product.js";
import Order from "../models/order.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function creatOrder(req,res){
    const data = req.body;
    const orderInfo ={
        orderedItems : []
    }

    if (req.user == null){
        res.status(401).json({message : "Please loging and try again"});
        return
    }
    orderInfo.email = req.user.email;

    const lastOrder = await Order.find().sort({orderDate:-1}).limit(1);

    if(lastOrder.length == 0){
        orderInfo.orderId = "ORD0001";
    }else{
        const lastOrderId = lastOrder[0].orderId;
        const lastOrderNumberInString = lastOrderId.replace("ORD","");
        const lastOrderNumber = parseInt(lastOrderNumberInString);
        const currentOrderNumber = lastOrderNumber + 1;
        const formattedNumber = String(currentOrderNumber).padStart(4, '0');
        orderInfo.orderId = "ORD" + formattedNumber;
    }

    let oneDayCost = 0;

    for (let i=0; i<data.orderedItems.length; i++){
        try{
            const product = await Product.findOne({key : data.orderedItems[i].key});

            if (product == null){
                res.status(404).json({message : "Product with key " + data.orderedItems[i].key + " not found"});
                return
            }
            if (product.availability == false){
                res.status(404).json({message : "Product with key " + data.orderedItems[i].key + " is not available"});
                return
            }


            orderInfo.orderedItems.push({
                product : {
                    key : product.key,
                    name : product.name,
                    img : product.img[0],
                    price : product.price
                },
                quantity : data.orderedItems[i].qty
            })

            oneDayCost += product.price * data.orderedItems[i].qty;


        }catch(e){
            console.log(e);
            res.status(500).json({message : "Order creation failed"});
            return
        }
    }
    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days;

    try {
        const newOrder = new Order(orderInfo);
        const result = await newOrder.save();
        res.json({
            message : "Order created successfully", 
            order : result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Order creation faild 2"});
    }
}

export async function getQuote(req,res) {

    const data = req.body;
    const orderInfo ={
        orderedItems : []
    }


    let oneDayCost = 0;

    for (let i=0; i<data.orderedItems.length; i++){
        try{
            const product = await Product.findOne({key : data.orderedItems[i].key});

            if (product == null){
                res.status(404).json({message : "Product with key " + data.orderedItems[i].key + " not found"});
                return
            }
            if (product.availability == false){
                res.status(404).json({message : "Product with key " + data.orderedItems[i].key + " is not available"});
                return
            }


            orderInfo.orderedItems.push({
                product : {
                    key : product.key,
                    name : product.name,
                    img : product.img[0],
                    price : product.price
                },
                quantity : data.orderedItems[i].qty
            })

            oneDayCost += product.price * data.orderedItems[i].qty;


        }catch(e){
            console.log(e);
            res.status(500).json({message : "Order creation failed"});
            return
        }
    }
    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days;

    try {
        res.json({
            message : "Order quatation", 
            total : orderInfo.totalAmount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Order creation faild 2"});
    }
}

export async function getOrders(req,res){

    if (isItCustomer(req)){
        try {
            const orders = await Order.find({email : req.user.email}); 
            res.json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({message : "faild to get orders"});
        }

    }else if (isItAdmin(req)){
        try {
            const orders = await Order.find(); 
            res.json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({message : "faild to get orders"});
        }
    }else{
        res.status(403).json({message : "you are not authorized to perform this action"});
    }
}