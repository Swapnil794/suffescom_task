const User = require("../model/user");
const bcrypt = require('bcrypt');


// users's id param
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "No user was found in DB"
        });
      }
      req.profile = user;
      next();
    });
};

//get user own's info
exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
};


hashpassword = (password) =>{
    const salt1 = bcrypt.genSalt();
    let salt = salt1.toString();
    console.log("auth file salt",salt);
    const encry_password = bcrypt.hash(password,salt);
    return {encry_password,salt}
};


exports.updatePassword =(req,res) =>{
    const password = req.body.password,
    p = hashpassword(password);
    User.findByIdAndUpdate({_id:req.profile._id},{$set:{encry_password:p.encry_password,salt:p.salt}},
         {new:true, useFindAndModify:false}).exec((err,user)=>{
            if(err){
                return res.status(400).json({
                    error : "someting went  wrong uses can't update"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            return res.json({message : "password update sucessfully",user})})

}

exports.userUpdate = (req,res) =>{
    User.findByIdAndUpdate({_id:req.profile._id},{$set:req.body},
        {new:true, useFindAndModify:false}).exec((err,user)=>{
        if(err){
            return res.status(400).json({
                err : "someting went  wrong uses can't update"
            })
        }
        user.salt = undefined;
        user.encry_password = undefined;
        return res.json({message : "user update sucessfully",user})
    })
}

exports.userDelete = (req,res)=>{
    let userId = req.params.userId;
    console.log("1001",userId);
    User.findByIdAndDelete({_id:req.profile._id})
        .exec((err,user)=>{
            if(err){
                return res.status(400).json({
                    err:"someting went wrong can't delete user"
                })
            }
            return res.json({message:"user delete sucessfully",user})
        })
}