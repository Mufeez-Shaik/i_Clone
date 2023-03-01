const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requirdlogin');
//  const { routes } = require('./auth');
const Post = mongoose.model('Post')


router.get('/allposts',requiredLogin,(req,resp)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts =>{
        resp.json({posts})
    })
    .catch(err =>{
        console.log(err)
    })
})



router.post('/creatpost',requiredLogin, (req,resp) =>{
    const {title,body} = req.body;
    if(!title || !body){
      return  resp.status(422).json({error : "Please add all the fields"})
    }
    // console.log(req.user)
    // resp.send("OK")
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        password:req.user
    })
    post.save().then(result =>{
        resp.json({Post : result})
    })
    .catch(err =>{
        console.log(err)
    })
})

router.get('/mypost',requiredLogin,(req,resp) =>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
        .then(mypost =>{
            resp.json({mypost})
        })
        .catch(err =>{
            console.log(err)
        })
    })

   
module.exports = router