const express = require("express");
const router = express.Router();


const {getUserById,getUser,userUpdate,updatePassword,userDelete} = require("../controller/user");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controller/auth");

router.param('userId',getUserById);

// get users own's info
router.get('/getuser/info/:userId',isSignedIn,isAuthenticated,getUser);
// update users info
router.put('/user/update/:userId',isSignedIn,isAuthenticated,userUpdate);
// update user's password
router.put('/user/update/password/:userId',isSignedIn,isAuthenticated,updatePassword)
//drop user
router.delete('/user/delete/:userId',isSignedIn,isAuthenticated,userDelete)

module.exports = router;