const express = require("express");
const userRouter = express.Router();

const {signup, signin} = require("../userControllers/usercontroller");


userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

// userRouter.post("/signup",(req,res)=>{
//     res.send("signup")
// })
// userRouter.post("/signin",(req,res)=>{
//     res.send("signin")
// })

module.exports = userRouter;