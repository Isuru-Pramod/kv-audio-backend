import Review from "../models/reviwe.js";

export async function addReview(req,res){
    if(req.user == null){
        res.status(401).json({
            message : "Please loging and try again"
        })
        return;
    }
    const data = req.body;

    data.name = req.user.firstName + " " + req.user.lastName;
    data.profilePic = req.user.profilePic;
    data.email = req.user.email;

    const newReview = new Review(data)

    try{
        await newReview.save();
        res.json({message : "review added successfully"});
    }catch(error){
        res.status(500).json({error : "you already have a review"});
        console.log(error);

    }
}


export function getReview(req,res){
    const user = req.user;

    if (user == null || user.role != "admin"){
        Review.find({isApproved : true}).then((Reviews)=>{
            res.json(Reviews);
        })
        return;
    }
    if (user.role == "admin"){
        Review.find().then((Reviews)=>{
            res.json(Reviews);
        })
    }
}

export function deleteReview (req,res){
    const email = req.params.email;

    if (req.user == null) {
        res.status(401).json({message : "plaese loging and try again"});
        return;
    }

    if (req.user.role == "admin"){
        Review.deleteOne({email : email}).then(()=>{
            res.json({message : "Review deleted"})
        }).catch(()=>{
            res.status(500).json({
                error : "Review deletion dailed"
            });
        })
        return;
    }

    if (req.user.role == "customer"){
        if (req.user.email == email){
            Review.deleteOne({email : email}).then(()=>{
                res.json({message : "Review deleted"})
            }).catch(()=>{
                res.status(500).json({
                    error : "Review deletion failed"
                });
            })
        }else{
            res.status(403).json({message : "you are not authorized to perform this action"});
        }
    }

}

export function approveReview(req,res){
    const email = req.params.email;

    if (req.user == null){
        res.status(401).json({
            message : "plaese login and try again"
        });
        return;
    }

    if (req.user.role == "admin"){
        Review.updateOne({email : email,},{isApproved : true,}).then(()=>{
            res.json({message : "Review approved successfully"})
        }).catch(()=>{
            res.status(500).json({error : "Review approval faild"})
        })
    }else{
        res.status(403).json({ message : "You are not an admin. only admin can approve the reviews "});
    }
}


