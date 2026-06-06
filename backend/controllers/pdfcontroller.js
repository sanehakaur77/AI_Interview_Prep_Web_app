
const Profile=require('../models/Profile');
exports.getPdfById=async(req,res)=>{
 const userId=req.params;
 try{
    const isPdf=await Profile.findById({userId});
    if(!ispdf){
        return res.status(401).json({meassage:"user profile not found",success:false});

    }
    return res.status(201).json({message:"pdf found!",
        success:true
    })
   
}
 catch(err){
        res.status(500).json({message:"error in finding pdf",success:false});
    }

}