var express = require('express');
var router = express.Router();
const { check } = require('express-validator');

// imporint mathods or userController
const {userSignout,userSignin,userSignup,isSignedIn,isAuthenticated,isAdmin} = require('../controller/auth')


// User Signup
router.post('/signup',[
    check("name","name atlest 3 char").isLength({min:3}),
    check("email","must be an email type").isEmail(),
   check("password","password atlest 3 char").isLength({min:3}),
   check("phoneNumber","phone can't be more than 10 digit").isLength({min:10})
],userSignup)

// User Signin
router.post('/signin',[
    check("email","must be an email type").isEmail(),
    check("password","password must required").isLength({min:3})
],userSignin)

// User Signout
router.get('/signout',userSignout);


router.get('/test',isSignedIn,(req,res)=>{
    res.json(req.auth)
})


module.exports = router;