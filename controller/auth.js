const User = require("../model/user");
const {validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// User signup controller
exports.userSignup =(req,res) =>
{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }
    const user = new User(req.body);
    console.log("9001",user);
    user.save((err,user) => { 
        console.log("9008",user);
        if(err){
            return res.status(400).json({
                err:"someting went wrong"
            })
        }
        res.json({

            _id:user._id,
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role
        });
    })
}


// user signin controller
exports.userSignin =(req,res)=>{
    const errors = validationResult(req)
    const {email,password} =req.body;
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    User.findOne({email},(err,user)=>{
        if(err || !user){
          return res.status(400).json({
                error :" use does not exit with this email"
            })
        }
        if(!user.autheticate(password)){
            res.status(401).json({
                error : "you entered the wrong password"
            })
        }
        // ceate jwtToken
        const token = jwt.sign({_id:user._id},process.env.SECRET)
        // put token in the cookie
        res.cookie("toekn",token,{expire:Date+22});
        // user response
        const {_id,name,email,role} = user;
        return res.json({token,user : { _id , name ,email ,role}});
    })

}

// user signout controller
exports.userSignout =(req,res) =>
{
    res.clearCookie('token');
    res.json({
        message:"User signout succefully"
    })
}

// protected routes (expressjwt includes next() in middlewares)
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    algorithms:['HS256'],
    userProperty:"auth"
})

// custom middleware
exports.isAuthenticated = (req, res, next) => {
    console.log("2001",req.profile);
    console.log("2002",req.auth);
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    console.log("2003",checker);
    if (!checker) {
      return res.status(403).json({
        error: "ACCESS DENIED"
      });
    }
    next();
};

exports.isAdmin = (req,res,next) =>{

    if(req.profile.role === 0){
        return res.status(403).json({
            error  : "you are not authrize for this"
        })
    }
    console.log("3001 admin verified");
    next();
}
