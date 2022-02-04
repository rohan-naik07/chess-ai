var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require('../db').userModel;
const bcrypt = require("bcrypt");

let onlineUsers = {}

/* GET users listing. */
router.get(
  '/', 
  function(req, res, next) {
    res.send('respond with a resource');
  }
)


router.post(
  '/login',
  function (req,res,next){
    Users.findOne({userName : req.body.userName})
    .then(async user=>{
      if (!user)
        return res.status(500).json({
            error: true,
            message: "Invalid Email ID",
        });
        const validatePassword = await bcrypt.compare( req.body.password,user.password); 
      if (!validatePassword)
          return res.status(500).json({
              error: true,
              message: "Invalid Password",
          });
      const token = jwt.sign({
              _id: user._id,
              userName: user.userName
          },"key"
      );
      res.status(200).json({ 
          error: false,
          token: token,
          userId : user._id,
          expiresIn : 3600
      });
    })
    .catch(error=>{
      console.error(error)
      res.status(500).json({
        error: true,
        message: error
      });
    })
  }
)

router.post(
  '/register',
  async function(req,res,next){
    Users.findOne({userName : req.body.userName})
    .then(async user=>{
      if (user)
        return res.status(400).json({ error: true, message: "User Already Registered" });
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        Users.create({
          userName : req.body.userName,
          password : password
        })
        .then(user=>{
          const token = jwt.sign({
                _id: user._id,
                userName: user.userName
            },"key");
            res.status(200).json({ 
                error: false,
                token: token,
                userId : user._id,
                expiresIn : 3600
            });
        })
        .catch(error=>{
          console.error(error)
          res.status(500).json({
            error: true,
            message: error
          });
        })
    })
    .catch(error=>{
      console.error(error)
      res.status(500).json({
        error: true,
        message: error
      });
    })
  }
)

// mark users online
router.post(
  '/online/:userId',
  async function(req,res,next){
    const _id = req.params.userId;
    onlineUsers[_id] = true;
    res.status(200).json({message : 200});
  }
)

// mark users offline
router.post(
  '/offline/:userId',
  async function(req,res,next){
     const _id = req.params.userId;
     delete onlineUsers[_id];
     res.status(200).json({message : 200});
  }
)

// get online users
router.get(
  verifyToken,
  '/online',
  async function(req,res,next){
     let users = []
     Object.keys(onlineUsers).forEach(async key=>{
       try {
        let user = await Users.findById(key);
        users.push(user);
       } catch (error) {
         console.error(error)
         res.status(500).json({
           error:true,
           message : error
         })
       }
     })
     console.log(users)
     res.status(200).json({
       error : false,
       message : users
     })
  }
)

const verifyToken = (req,res,next)=>{
  const header = req.headers['authorization'];
  if(typeof header!=='undefined') {
      const bearer = header.split(' ');
      const token = bearer[0];
      console.log(header)
      req.token = token;
      next();
  } else {
      res.sendStatus(403);
      res.end('Unauthorized');
  }
}

module.exports = {
  authRouter: authRouter,
  verifyToken : verifyToken
}
