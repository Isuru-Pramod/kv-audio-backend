import Review from "../models/reviwe.js";

export function addReview(req,res){
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

    newReview.save().then(()=>{
        res.json({
            message : "review added successfully"
        });
    }).catch((error)=>{
        res.status(500).json({
            error : "Review addition failed"
        });
    })
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

    Review.deleteOne({email : email}).then(()=>{
        res.json({message : "Review deleted"})
    }).catch(()=>{
        res.status(500).json({
            error : "Review deletion dailed"
        });
    })
}


