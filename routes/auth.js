const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {JWT_SEC} = require('../keys')
const requiredLogin = require('../middlewares/requirdlogin.js')

 
// router.get('/protected',requiredLogin,(req,resp) =>{
//     resp.send("Hello Mufeez")
// })

router.post('/signup',(req,resp) =>{
    const{name,email,password} = req.body;
if(!email || !password || !name){
    return resp.status(422).json({error:"please add all the fields"})
}
 User.findOne({email:email})
 .then((savedUser) =>{
    if(savedUser){
        return resp.status(422).json({error:"user already exists with email"})
    }
bcrypt.hash(password,12)
.then(hashedpassword => {
    const user = new User({
        email,
        password : hashedpassword,
        name
    })
    user.save()
    .then(user =>{
        resp.json({message: "saved successfully"})
    
    })
    .catch(err => {
        console.log(err)
    })

})


    
 })
 .catch(err =>{
    console.log(err)
 })

})


router.post('/signin',(req,resp) =>{
    const {email,password} = req.body
    if(!email || !password){
       return resp.status(422).json({error :"please add your email and password"})
    }
    User.findOne({email : email})
    .then(savedUser =>{
        if(!savedUser){
        return resp.status(422).json({error :"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(didMatch =>{
            if(didMatch){
                // resp.json({message:"Successfully signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SEC)
                resp.json({token})
            }
        else{
            return resp.status(422).json({error:"invalid email or password"})
        }
    })
    .catch(err =>{
        console.log(err)
    })

})
})

module.exports = router