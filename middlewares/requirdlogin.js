const jwt = require('jsonwebtoken');
const {JWT_SEC} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,resp,next) =>{
    const {authorization} = req.headers
    if(!authorization){
      return resp.status(401).json({error:"you must logged in first"})
    }


    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SEC,(err,payload) =>{
        if(err){
          return resp.status(401).json({error :"you must logged in first"})
        }
        const {_id} = payload
        User.findById(_id).then(userdata =>{
            req.user = userdata
            next()
        })
        
    })
}